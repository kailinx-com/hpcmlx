from django.db import models
from django.utils import timezone
from datetime import date

"""
tag model
"""
class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, help_text="Name of the tag")

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'

    def __str__(self):
        return self.name

"""
experiments model
"""
class Experiment(models.Model):
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=255, help_text="Title of the experiment")
    github = models.URLField(blank=True, null=True, help_text="GitHub repository URL")
    description = models.TextField(blank=True, null=True, help_text="Description of the experiment")
    content = models.TextField(blank=True, null=True, help_text="Markdown content for the experiment")
    tags = models.ManyToManyField(Tag, blank=True, help_text="Tags for categorizing experiments")
    date = models.DateField(default=date.today, help_text="Date the experiment was performed")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the experiment was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp when the experiment was last updated")

    class Meta:
        ordering = ['-created_at', '-updated_at']
        verbose_name = 'Experiment'
        verbose_name_plural = 'Experiments'

    def __str__(self):
        return self.title