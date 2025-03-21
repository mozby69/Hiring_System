
from django.shortcuts import render
from .. models import UserAcc,UserDetails,JobList,Branches
from django.contrib.auth.models import User
import json
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import JsonResponse
import re
from django.shortcuts import render, get_object_or_404



def joblisting(request):
    branches = Branches.objects.all()
    jobs = JobList.objects.all().order_by('-JobDate')
    return render(request, 'HromTemp/JobListing.html', {'branches': branches, 'jobs':jobs})


def insert_jobList(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            job_title = data.get('job_title')
            job_branch_code = data.get('job_branch') 
            job_province = data.get('job_province')
            job_city = data.get('job_city')
            job_brgy = data.get('job_brgy')
            job_desc = data.get('job_desc')
            emp_role = data.get('emp_role')
            employment_types = data.get('employment_types', [])
            job_benefits = data.get('job_benefits', [])  #
            job_qualifications = data.get('job_qualifications', [])

            if not job_branch_code:
                return JsonResponse({"success": False, "error": "Please select a branch."})

            branch = Branches.objects.get(BranchCode=job_branch_code)
            existing_jobs = JobList.objects.filter(BranchCode=branch)

            job_numbers = []
            for job in existing_jobs:
                match = re.search(r'_(\d+)$', job.JobCode)  
                if match:
                    job_numbers.append(int(match.group(1)))

         
            new_number = max(job_numbers) + 1 if job_numbers else 1
            new_job_code = f"{branch.BranchCode}_{new_number}"

            jobList = JobList(
                JobCode=new_job_code,
                JobTitle=job_title,
                BranchCode=branch,
                JobProvince=job_province,
                JobCity=job_city,
                JobBrgy=job_brgy,
                JobDesc=job_desc,
                JobRole=emp_role,
                JobTypes=employment_types,
                JobBenefits=job_benefits,
                JobQual=job_qualifications,

            )
            jobList.save()

            return JsonResponse({"success": True, "job_code": new_job_code,"emp_role":emp_role})
        except Branches.DoesNotExist:
            return JsonResponse({"success": False, "error": "Invalid branch selected."})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})

    return JsonResponse({"success": False, "error": "Invalid request"})




@csrf_exempt
def get_job_details(request, job_code):
    if request.method == "GET":
        try:
            job = get_object_or_404(JobList, JobCode=job_code)
            print('Job object:', job.JobCode, job.JobBenefits, job.JobQual)  # Debug log
            job_data = {
                'JobCode': job.JobCode,
                'JobTitle': job.JobTitle,
                'BranchCode': job.BranchCode.BranchCode,
                'JobProvince': job.JobProvince,
                'JobCity': job.JobCity,
                'JobBrgy': job.JobBrgy,
                'JobDesc': job.JobDesc,
                'JobRole': job.JobRole,
                'JobTypes': job.JobTypes if isinstance(job.JobTypes, list) else (json.loads(job.JobTypes) if job.JobTypes else []),
                'JobBenefits': job.JobBenefits if isinstance(job.JobBenefits, list) else (json.loads(job.JobBenefits.replace("'", '"')) if job.JobBenefits else []),
                'JobQual': job.JobQual if isinstance(job.JobQual, list) else (json.loads(job.JobQual.replace("'", '"')) if job.JobQual else [])
            }
         
            return JsonResponse({"success": True, "job": job_data})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Invalid request"})



def update_jobList(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            job_code = data.get('job_code')
            job_title = data.get('job_title')
            job_branch_code = data.get('job_branch')
            job_province = data.get('job_province')
            job_city = data.get('job_city')
            job_brgy = data.get('job_brgy')
            job_desc = data.get('job_desc')
            emp_role = data.get('emp_role')
            employment_types = data.get('employment_types', [])
            job_benefits = data.get('job_benefits', [])
            job_qualifications = data.get('job_qualifications', [])

            if not job_code or not job_branch_code:
                return JsonResponse({"success": False, "error": "Job code and branch are required."})

            job = get_object_or_404(JobList, JobCode=job_code)
            branch = get_object_or_404(Branches, BranchCode=job_branch_code)

            job.JobTitle = job_title
            job.BranchCode = branch
            job.JobProvince = job_province
            job.JobCity = job_city
            job.JobBrgy = job_brgy
            job.JobDesc = job_desc
            job.JobRole = emp_role
            job.JobTypes = employment_types
            job.JobBenefits = list(set(job_benefits))  # Remove duplicates
            job.JobQual = list(set(job_qualifications))  # Remove duplicates
            job.save()
 

            return JsonResponse({"success": True, "message": "Job updated successfully", "job_code": job_code})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Invalid request method"})

def delete_job(request, job_code):
    if request.method == "DELETE":
        try:
            job = get_object_or_404(JobList, JobCode=job_code)
            job.delete()
            return JsonResponse({"success": True, "message": "Job deleted successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Invalid request method"})