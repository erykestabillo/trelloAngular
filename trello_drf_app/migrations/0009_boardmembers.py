# Generated by Django 2.0.13 on 2019-10-31 08:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('trello_drf_app', '0008_boardinvite'),
    ]

    operations = [
        migrations.CreateModel(
            name='BoardMembers',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('board', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='trello_drf_app.Board')),
                ('member', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]