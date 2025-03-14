from django.urls import path
from . import views
from .Controller import JobList, JobSearch, RecruitHiring, FaceMetrics
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
      path('', views.Home, name='login'),
      path('create_customer/', views.create_user, name='create_customer'),
      path('main_content/', views.main_content, name='main_content'),
      path('useracc/', views.useracc, name='useracc'),
      path("get_user_data/<str:usercode>/", views.get_user_data, name="get_user_data"),
      path("login/", views.login_view, name="login"),
      path("logout/", views.logout_view, name="logout"),

      path('Jobsearch/', JobSearch.Jobsearch, name='Jobsearch'),
      path("add-skill/", JobSearch.add_skill_sets, name="add-skill"),
      path("remove-skill/", JobSearch.remove_skill, name="remove-skill"),
       path("update-user-details/", JobSearch.update_user_details, name="update-user-details"),

      path('joblisting/', JobList.joblisting, name='joblisting'),

      path('facemetrics/', FaceMetrics.facemetrics, name='facemetrics'),

      path('recruitorhiring/', RecruitHiring.recruitorhiring, name='recruitorhiring'),
      path('get_applications/', RecruitHiring.get_applications, name='get_applications'),
      path('get_pending_applications/', RecruitHiring.get_pending_applications, name='get_pending_applications'),
      path('get_final_applications/', RecruitHiring.get_final_applications, name='get_final_applications'),
      path('get_reject_applications/', RecruitHiring.get_reject_applications, name='get_reject_applications'),
      path('delete-employee/', RecruitHiring.delete_employee, name='delete-employee'),
      path('insert_jobList/',JobList.insert_jobList, name="insert_jobList"),
      path('update_jobList/', JobList.update_jobList, name='update_jobList'),
      path('get_job_details/<str:job_code>/', JobList.get_job_details, name='get_job_details'),
      path('delete_job/<str:job_code>/',JobList.delete_job,name="delete_job"),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



