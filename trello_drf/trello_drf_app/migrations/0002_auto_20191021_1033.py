# Generated by Django 2.0.13 on 2019-10-21 10:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('trello_drf_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boards', to=settings.AUTH_USER_MODEL),
        ),
    ]
