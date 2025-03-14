
from django.shortcuts import render
import json
from .. models import UserAcc,UserDetails,PendingApplication,InProgressApplication,RejectedApplication
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.db.models import Q
from django.utils.text import slugify
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404


def Jobsearch(request):
    user = request.user
    user_details = UserAcc.objects.filter(Username = user).first()
    user_info = UserDetails.objects.filter(ApplicantCode_id = user_details.UserCode).first()
    return render(request, 'HromTemp/Jobsearch.html',{"user_details":user_details, "user_info":user_info})


def add_skill_sets(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            applicant_code = request.user
            new_skill = data.get("new_skill")

            user_details = UserAcc.objects.filter(Username = applicant_code).first()
            user = UserDetails.objects.filter(ApplicantCode__UserCode=user_details.UserCode).first()
            
            if not user:
                return JsonResponse({"success": False, "error": "User not found."}, status=404)

            user_skills = user.UserSkills if user.UserSkills else []

            if new_skill in user_skills:
                return JsonResponse({"success": False, "error": "Skill already exists."})

            user_skills.append(new_skill)
            user.UserSkills = user_skills
            user.save()

            return JsonResponse({"success": True, "message": "Skill added successfully!"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
@csrf_exempt  
def remove_skill(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            applicant_code = request.user
            skill_to_remove = data.get("skill")

            user_details = UserAcc.objects.filter(Username = applicant_code).first()

            user = UserDetails.objects.filter(ApplicantCode__UserCode=user_details.UserCode).first()
            
            if not user:
                return JsonResponse({"success": False, "error": "User not found."}, status=404)

            user_skills = user.UserSkills if user.UserSkills else []

            if skill_to_remove not in user_skills:
                return JsonResponse({"success": False, "error": "Skill not found."})

            user_skills.remove(skill_to_remove)
            user.UserSkills = user_skills
            user.save()

            return JsonResponse({"success": True, "message": "Skill removed successfully!"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request method."}, status=400)



@csrf_exempt 
def update_user_details(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            field = data.get("field")
            value = data.get("value")
            user = request.user  
            user_details = UserAcc.objects.filter(Username = user).first()
            user_details, created = UserDetails.objects.get_or_create(ApplicantCode__UserCode=user_details.UserCode)

            if field in ["AboutUser", "UserAddress"]: 
                setattr(user_details, field, value)
                user_details.save()

                return JsonResponse({"success": True, "message": "Updated successfully!"})

            return JsonResponse({"success": False, "message": "Invalid field."})

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})

    return JsonResponse({"success": False, "message": "Invalid request."})
