import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('StudyRadar', '0002_studygroup'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='grad_year',
            field=models.CharField(blank=True, max_length=4, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='phone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='studygroup',
            name='subject',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),

    ]
