from django.shortcuts import render
import json
from . models import UserAcc,UserDetails
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import logout



@csrf_protect
def logout_view(request):
    if request.method == "POST":
        try:
            user = request.user
            user_acc = UserAcc.objects.get(Username=user.username)
            user_acc.is_active = False  
            user_acc.save()
            logout(request) 
            return JsonResponse({"success": True, "message": "Successfully logged out."})
        except UserAcc.DoesNotExist:
            return JsonResponse({"success": False, "message": "User account not found."})

    return JsonResponse({"success": False, "message": "Invalid request."})


@csrf_protect
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)  
        if user is not None:
            login(request, user) 


            try:
                user_acc = UserAcc.objects.get(Username=username)
                user_acc.is_active = True
                user_acc.save()
            except UserAcc.DoesNotExist:
                return JsonResponse({"success": False, "message": "User account not found in UserAcc table."})

            return JsonResponse({"success": True, "message": "You have successfully logged in."})
        else:
            return JsonResponse({"success": False, "message": "Invalid username or password."})

    return JsonResponse({"success": False, "message": "Invalid request."})


def Home(reuqest):
    return render(reuqest, 'HromTemp/Login.html')

def main_content(request):
    return render(request, 'HromTemp/main-content.html') 

@csrf_protect
def create_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        fullname = data.get('fullname')
        username = data.get('username')
        password = data.get('password')
        contact = data.get('contact')
        emailadd = data.get('emailadd')

        if UserAcc.objects.filter(Username=username).exists():
            return JsonResponse({"success": False, "message": "There is an existing user for that username"})


        user = User.objects.create(
            username=username,
            email=emailadd,
            password=make_password(password) 
        )

        user = UserAcc(
            UserFullname=fullname,
            Username=username,
            Password=password,
            ContactNum=contact,
            Email=emailadd
        )

        user.save()  


        

        return JsonResponse({"success": True, "UserCode": user.UserCode})
    
    return JsonResponse({"success": False})

def useracc(request):
    User_Acc = UserAcc.objects.all()
    return render(request, 'HromTemp/UserAcc.html', {'User_Acc': User_Acc})

def get_user_data(request, usercode):
    user = get_object_or_404(UserAcc, UserCode=usercode)
    user_details = UserDetails.objects.filter(ApplicantCode=user).first()
    data = {
        "fullname": user.UserFullname,
        "username": user.Username,
        "contact": user.ContactNum,
        "email": user.Email,
        "pass": user.Password,
        "about": user_details.AboutUser if user_details else None 

    }
    return JsonResponse(data)



