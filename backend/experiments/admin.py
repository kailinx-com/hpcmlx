from django.contrib import admin
from .models import (
    Tag, Experiment
)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'name'
    )

@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'github',
        'description',
        'get_tags',
        'date',
        'created_at',
        'updated_at'
    )
    
    # list the tags for the experiment
    def get_tags(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])
    get_tags.short_description = 'Tags'
