# Generated by Django 4.2.7 on 2025-03-10 02:06

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('HromApp', '0008_useracc_is_active'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useracc',
            name='AboutUser',
        ),
        migrations.AlterField(
            model_name='jobapplication',
            name='DateApplied',
            field=models.DateField(default=datetime.date(2025, 3, 10), null=True),
        ),
        migrations.AlterField(
            model_name='joblist',
            name='JobDate',
            field=models.DateField(default=datetime.date(2025, 3, 10), null=True),
        ),
        migrations.CreateModel(
            name='UserDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('AboutUser', models.CharField(blank=True, default='', max_length=500, null=True)),
                ('UserAddress', models.CharField(default='N/D', max_length=150)),
                ('UserSkills', models.JSONField()),
                ('UserResume', models.CharField(default='N/D', max_length=150)),
                ('ApplicantCode', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='HromApp.useracc')),
            ],
        ),
    ]
