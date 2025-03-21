from django.db import models
from datetime import date,datetime

# Create your models here.


class Branches(models.Model):
    BranchCode = models.CharField(max_length=20,unique=True,primary_key=True)
    Company = models.CharField(max_length=50)
    Location = models.CharField(max_length=50)
    Employees = models.CharField(max_length=10)
    BranchImage = models.ImageField(upload_to='branch_image/', null=True, blank=True)


class Employee(models.Model):
    EmpCode = models.CharField(max_length=20,unique=True,primary_key=True)
    IdNo = models.CharField(max_length=5, default= None, null=True, blank=True)
    BranchCode = models.ForeignKey(Branches, on_delete = models.SET_NULL, to_field = 'BranchCode', null = True)
    Firstname = models.CharField(max_length=20)
    Middlename = models.CharField(max_length=20)
    Lastname = models.CharField(max_length=20)
    Suffix = models.CharField(max_length=5,default=None, null=True)
    DateofBirth = models.DateField(default=None, null=True)
    BirthPlace = models.CharField(default=None, max_length=50, null=True)
    Age = models.CharField(default=None, max_length=5,null=True)
    BloodType = models.CharField(max_length=3, default="N/D")
    Gender = models.CharField(max_length=8, default="Male")
    CivilStatus = models.CharField(max_length=10, default="N/A")
    Address = models.CharField(max_length=200, default="N/D")
    HomeAddress = models.CharField(max_length=200, default=None, null=True)
    PhoneNo = models.CharField(max_length=12, default=None, null=True)
    Email = models.CharField(max_length=50, default=None, null=True)
    Position = models.CharField(max_length=50)
    Department = models.CharField(max_length=50, default="N/A", null=True, blank=True)
    EmployementDate = models.DateField(default=None, null=True)
    EmploymentStatus = models.CharField(max_length=15,default="Regular")
    EmployeeStatus = models.CharField(max_length=15, default=None, null=True)
    EmpImage = models.CharField(max_length=50, default="N/A", null=True, blank=True)



class JobList(models.Model):
    JobCode =  models.CharField(max_length=20,unique=True,primary_key=True)
    BranchCode = models.ForeignKey(Branches, on_delete = models.SET_NULL, to_field = 'BranchCode', null = True)
    JobDate = models.DateTimeField(default=datetime.now, null=True)
    JobTitle = models.CharField(max_length=50,default="N/D",null=True,blank=True)
    JobProvince = models.CharField(max_length=100,default="N/D",blank=True,null=True)
    JobCity = models.CharField(max_length=100,default="N/D",blank=True,null=True)
    JobBrgy = models.CharField(max_length=100,default="N/D",blank=True,null=True)
    JobRole = models.CharField(max_length=100, blank=True,null=True,default="N/D")
    JobDesc = models.CharField(max_length=120, default="N/D",null=True,blank=True)
    JobBenefits = models.JSONField(null=True, blank=True)
    JobQual = models.JSONField(null=True, blank=True)
    JobTypes = models.JSONField(null=True, blank=True)  



class UserAcc(models.Model):
    UserCode = models.CharField(max_length=30, unique=True, primary_key=True)
    UserFullname = models.CharField(max_length=100, null=False, blank=False, default="N/D")
    Username = models.CharField(max_length=50, blank=False, null=False, unique=False)
    is_active = models.BooleanField(default=False)
    Password = models.CharField(max_length=50, blank=False, null=False)
    ContactNum = models.CharField(max_length=11, blank=False, null=False)
    Email = models.EmailField(unique=True, blank=False, null=False)
    AccDate = models.DateField(default=date.today, null=True)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        if not self.UserCode:
            total_records = UserAcc.objects.count() + 1

            self.UserCode = f"{self.Username}_{total_records}"

        super().save(*args, **kwargs)
        
        # Automatically create a UserDetails entry if it's a new user
        if is_new:
            UserDetails.objects.create(ApplicantCode=self)

class UserDetails(models.Model):
    ApplicantCode = models.ForeignKey(UserAcc, on_delete= models.SET_NULL, to_field= 'UserCode', null = True) 
    AboutUser = models.CharField(max_length=500, blank=True, null=True, default="")
    UserAddress = models.CharField(max_length=150, null=False,blank=False, default="N/D")
    UserSkills = models.JSONField(null=True, blank=True)
    UserResume = models.CharField(max_length=150, null=False,blank=False, default="N/D")



class JobApplication(models.Model):
    ApplicationCode = models.CharField(max_length=20, unique=True,primary_key=True)
    ApplicantCode = models.ForeignKey(UserAcc, on_delete= models.SET_NULL, to_field= 'UserCode', null = True) 
    JobCode = models.ForeignKey(JobList, on_delete= models.SET_NULL, to_field= 'JobCode', null = True) 
    DateApplied = models.DateField(default=date.today(),null=True)
    YearsofExp = models.CharField(max_length=20,blank=False,null=False,default="N/D")
    ExpectedSalary = models.CharField(max_length=20,default="N/D",null=False,blank=False)
    ApplicationStatus = models.CharField(max_length=50,blank=False,null=False,default="N/D")
    Remarks = models.CharField(max_length=100,blank=False,null=False,default="N/D")
    


class InProgressApplication(models.Model):
    InProgCode = models.CharField(max_length=20, unique=True, primary_key=True)
    ApplicationCode = models.ForeignKey(JobApplication, on_delete= models.SET_NULL, to_field= "ApplicationCode", null=True)
    AssesmentDate = models.DateField(default=None,null=True)
    AssesmentStatus = models.CharField(max_length=20,blank=False,null=False,default="N/D")
    InitInterview = models.BooleanField(default=False)
    Exams = models.BooleanField(default=False)
    CiBi = models.BooleanField(default=False)
    FinalInterview = models.BooleanField(default=False)

class PendingApplication(models.Model):
    PendingCode = models.CharField(max_length=20, unique=True, primary_key=True)
    ApplicationCode = models.ForeignKey(JobApplication, on_delete= models.SET_NULL, to_field="ApplicationCode", null=True)
    ApplicationSched = models.DateField(default=None,null=True)
    SchedBy = models.CharField(max_length=10,default="N/D",null=True,blank=True)
    PendingStatus = models.CharField(max_length=100, blank=True,null=True, default="N/D")
    Remarks = models.CharField(max_length=100,default="N/D", null=True, blank=True)

class RejectedApplication(models.Model):
    RejectedCode = models.CharField(max_length=20, unique=True, primary_key=True)
    ApplicationCode = models.ForeignKey(JobApplication, on_delete= models.CASCADE, to_field="ApplicationCode")
    RejectedDate = models.DateField(default=None,null=True)
    ApplicationStage = models.CharField(max_length=50, default="N/D", null=True, blank=True)
    Remarks = models.CharField(max_length=100,default="N/D", null=True, blank=True)

