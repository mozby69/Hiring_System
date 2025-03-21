
from django.shortcuts import render
import json
from .. models import JobApplication,PendingApplication,InProgressApplication,RejectedApplication
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.core.paginator import Paginator




def save_schedule(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            application_code = data.get('application_code') 
            selected_date = data.get('selected_date')  
            remarks = data.get('remarks')

            if not application_code or not selected_date or not remarks:
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

      
            application_code = str(application_code) 
   
            job_application = JobApplication.objects.filter(ApplicationCode=application_code).first()

            if not job_application:
                return JsonResponse({'success': False, 'error': 'Job Application not found'}, status=404)

     
            last_pending = PendingApplication.objects.order_by('-PendingCode').first()

            if last_pending and last_pending.PendingCode.isdigit():
                next_pending_code = str(int(last_pending.PendingCode) + 1)
            else:
                next_pending_code = "1"

       
            pending_application, created = PendingApplication.objects.get_or_create(
                ApplicationCode=job_application,  
                defaults={
                    'PendingCode': next_pending_code, 
                    'ApplicationSched': selected_date,
                    'Remarks': remarks
                }
            )
            if not created:
                pending_application.ApplicationSched = selected_date
                pending_application.Remarks = remarks
                pending_application.save()

            return JsonResponse({'success': True, 'message': 'Schedule saved successfully!'})

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)




def recruitorhiring(request):
    return render(request, 'HromTemp/RecruitorHiring.html') 

def get_applications(request):
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('pageSize', 10))
        search_value = request.GET.get('searchValue', '')
        sort_column_index = int(request.GET.get('sortColumnIndex', 0))
        sort_direction = request.GET.get('sortDirection', 'asc')

        column_mapping = {
            0: 'ApplicationCode',  
            1: 'DateApplied',  
            2: 'ApplicationStatus'   
        }

        sort_column = column_mapping.get(sort_column_index, 'DateApplied')
        if sort_direction == 'asc':
            sort_column = f'-{sort_column}'

        emp_reqs = JobApplication.objects.exclude(ApplicationStatus__in =["Pending", "Rejected"])

        if search_value:
            emp_reqs = emp_reqs.filter(
                Q(ApplicantCode__UserFullname__icontains=search_value) |
                Q(JobCode__JobTitle__icontains=search_value) 
            )

        emp_reqs = emp_reqs.order_by(sort_column)

        paginator = Paginator(emp_reqs, page_size)
        page_obj = paginator.get_page(page)

        empreqs_data = [
            {
                'ApplicantName': emp.ApplicantCode.UserFullname,
                'DateApplied': emp.DateApplied,
                'JobTitle': emp.JobCode.JobTitle,
                'YearsofExp': emp.YearsofExp,
                'ExpectedSalary': emp.ExpectedSalary,
                'actions': (
                    f'<div class="actions-style">'
                    f'<span class="view-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.ApplicationCode}" '
                    f'data-applicant="{emp.ApplicantCode.UserFullname}" '
                    f'data-jobtitle="{emp.JobCode.JobTitle}" '
                    f'data-yearsofexp="{emp.YearsofExp}" '
                    f'data-expectedsalary="{emp.ExpectedSalary}" '
                    f'onclick="handleActionClick(event, \'view-custom-modal\')">'
                    f' preview </span>'
                    f'<span class="calendar-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.ApplicationCode}" '
                    f'data-jobtitle="{emp.JobCode.JobTitle}" '
                    f'onclick="handleActionClick(event, \'edit-custom-modal\')">'
                    f' calendar_add_on </span>'
                    f'<span class="cancel-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.ApplicationCode}" '
                    f'data-jobtitle="{emp.JobCode.JobTitle}" '
                    f'onclick="handleActionClick(event, \'delete-custom-modal\')">'
                    f' cancel </span>'
                    f'</div>'
                )
            }
            for emp in page_obj
        ]

        return JsonResponse({
            'data': empreqs_data,
            'recordsTotal': paginator.count,
            'recordsFiltered': paginator.count
        })
    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error', 'details': str(e)}, status=500)


def get_pending_applications(request):
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('pageSize', 10))
        search_value = request.GET.get('searchValue', '')
        sort_column_index = int(request.GET.get('sortColumnIndex', 0))
        sort_direction = request.GET.get('sortDirection', 'asc')

        column_mapping = {
            0: 'PendingCode',  
            1: 'ApplicationSched',  
            2: 'JobTitle'   
        }

        sort_column = column_mapping.get(sort_column_index, 'ApplicationSched')
        if sort_direction == 'asc':
            sort_column = f'-{sort_column}'

        emp_reqs = PendingApplication.objects.all()

        if search_value:
            emp_reqs = emp_reqs.filter(
                Q(ApplicationCode__ApplicantCode__UserFullname__icontains=search_value) |
                Q(ApplicationCode__JobCode__JobTitle__icontains=search_value) 
            )


        emp_reqs = emp_reqs.order_by(sort_column)
        paginator = Paginator(emp_reqs, page_size)
        page_obj = paginator.get_page(page)

        empreqs_data = [
            {
                'ApplicantName': emp.ApplicationCode.ApplicantCode.UserFullname,
                'SchedApp': emp.ApplicationSched,
                'JobTitle': emp.ApplicationCode.JobCode.JobTitle,
                'SchedBy': emp.SchedBy,
                'Status': emp.PendingStatus,
                'actions': (
                    f'<div class= "actions-style">'

                    f'<span class="view-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.ApplicationCode}" '
                    f'data-applicant="{emp.ApplicationCode.ApplicantCode.UserFullname}" '
                    f'data-jobtitle="{emp.ApplicationCode.JobCode.JobTitle}" '
                    f'data-yearsofexp="{emp.ApplicationCode.YearsofExp}" '
                    f'data-expectedsalary="{emp.ApplicationCode.ExpectedSalary}" '
                    f'onclick="handleActionClick(event, \'view-custom-modal\')">'
                    f' preview </span>'

                    f'<span class="calendar-edit-icon-style material-symbols-outlined" '
                    f'style="pointer-events: pointer;" '
                    f'onclick="handleActionClick(event, \'immediate-sched-custom-modal\')">'
                    f'pending_actions</span>'

                    f'<span class="cancel-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.PendingCode}" '
                    f'data-jobtitle="{emp.ApplicationCode.JobCode.JobTitle}" '
                    f'onclick="handleActionClick(event, \'delete-custom-modal\')">'
                    f' cancel </span>'
                    
                    f'</div>'
                )
            }
            for emp in page_obj
        ]

        return JsonResponse({
            'data': empreqs_data,
            'recordsTotal': paginator.count,
            'recordsFiltered': paginator.count
        })
    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error', 'details': str(e)}, status=500)


def get_final_applications(request):
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('pageSize', 10))
        search_value = request.GET.get('searchValue', '')
        sort_column_index = int(request.GET.get('sortColumnIndex', 0))
        sort_direction = request.GET.get('sortDirection', 'asc')

        column_mapping = {
            0: 'InProgCode',  
            1: 'AssesmentDate',  
            2: 'AssesmentStatus'   
        }
        sort_column = column_mapping.get(sort_column_index, 'AssesmentDate')
        if sort_direction == 'asc':
            sort_column = f'-{sort_column}'

        emp_reqs = InProgressApplication.objects.filter(AssesmentStatus="Ongoing")

        if search_value:
            emp_reqs = emp_reqs.filter(
                Q(ApplicationCode__ApplicantCode__UserFullname__icontains=search_value) |
                Q(ApplicationCode__JobCode__JobTitle__icontains=search_value) 
            )

        emp_reqs = emp_reqs.order_by(sort_column)

        paginator = Paginator(emp_reqs, page_size)
        page_obj = paginator.get_page(page)

        empreqs_data = [
            {
                'ApplicantName': emp.ApplicationCode.ApplicantCode.UserFullname,
                'AssesmentDate': emp.AssesmentDate,
                'InitInterview': emp.InitInterview,
                'Exams': emp.Exams,
                'Cibi': emp.CiBi,
                'FinalInterview':emp.FinalInterview,
                'actions': (
                    f'<div class= "actions-style">'
                    f'<span class="view-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.InProgCode}" '
                    f'data-jobtitle="{emp.ApplicationCode.JobCode.JobTitle}" '
                    f'onclick="handleActionClick(event, \'progress-custom-modal\')">'
                    f' preview </span>'
                    f'<span class="approve-icon-style material-symbols-outlined style="pointer-events: none;"'
                    f'"> <a class="a-hist" style="color: #6ABEA1; pointer-events: auto;" href="#" onclick="event.stopPropagation()"></a>'
                    f' fact_check </span>'
                    f'<span class="cancel-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.InProgCode}" '
                    f'data-jobtitle="{emp.ApplicationCode.JobCode.JobTitle}" '
                    f'onclick="handleActionClick(event, \'delete-custom-modal\')">'
                    f' cancel </span>'
                    f'</div>'
                )
            }
            for emp in page_obj
        ]

        return JsonResponse({
            'data': empreqs_data,
            'recordsTotal': paginator.count,
            'recordsFiltered': paginator.count
        })
    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error', 'details': str(e)}, status=500)
    

def get_reject_applications(request):
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('pageSize', 10))
        search_value = request.GET.get('searchValue', '')
        sort_column_index = int(request.GET.get('sortColumnIndex', 0))
        sort_direction = request.GET.get('sortDirection', 'asc')

        column_mapping = {
            0: 'RejectedCode',  
            1: 'RejectedDate'
        }
        sort_column = column_mapping.get(sort_column_index, 'RejectedDate')
        if sort_direction == 'asc':
            sort_column = f'-{sort_column}'

        emp_reqs = RejectedApplication.objects.all()

        if search_value:
            emp_reqs = emp_reqs.filter(
                Q(ApplicationCode__ApplicantCode__UserFullname__icontains=search_value) |
                Q(ApplicationCode__JobCode__JobTitle__icontains=search_value) 
            )


        emp_reqs = emp_reqs.order_by(sort_column)

        paginator = Paginator(emp_reqs, page_size)
        page_obj = paginator.get_page(page)

        empreqs_data = [
            {
                'ApplicantName': emp.ApplicationCode.ApplicantCode.UserFullname,
                'DateRejected': emp.RejectedDate,
                'ApplicationStage': emp.ApplicationStage,
                'Remarks': emp.Remarks,
                'actions': (
                    f'<div class= "actions-style">'
                    f'<span class="view-icon-style material-symbols-outlined style="pointer-events: none;"'
                    f'"> <a class="a-hist" style="color: #6ABEA1; pointer-events: auto;" href="#" onclick="event.stopPropagation()"></a>'
                    f' preview </span>'
                    f'<span class="calendar-edit-icon-style material-symbols-outlined style="pointer-events: none;"'
                    f'"> <a class="a-hist" style="color: #6ABEA1; pointer-events: auto;" href="#" onclick="event.stopPropagation()"></a>'
                    f' edit_calendar </span>'
                    f'<span class="cancel-icon-style material-symbols-outlined" '
                    f'data-applicantcode="{emp.RejectedCode}" '
                    f'data-jobtitle="{emp.ApplicationCode.JobCode.JobTitle}" '
                    f'onclick="handleActionClick(event, \'delete-custom-modal\')">'
                    f' cancel </span>'
                    f'</div>'
                )
            }
            for emp in page_obj
        ]

        return JsonResponse({
            'data': empreqs_data,
            'recordsTotal': paginator.count,
            'recordsFiltered': paginator.count
        })
    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error', 'details': str(e)}, status=500)
    
@csrf_exempt
def delete_employee(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            applicant_code = data.get('applicant_code')
            activeTab = data.get('activeTab')

            if activeTab == "newApplications":
                JobApplication.objects.filter(ApplicationCode = applicant_code).update(Status="Rejected")
            elif activeTab == "PendingApplication":
                print("This is the pending applicant code: ",applicant_code)
            elif activeTab == "progressApplications":
                print("This is the progress applicant code: ",applicant_code)
            elif activeTab == "RejectedApplication":
                print("This is the reject applicant code: ",applicant_code)

            return JsonResponse({'success': True})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})


