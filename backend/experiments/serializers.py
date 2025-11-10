from rest_framework import serializers
from .models import Experiment, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ExperimentSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        source='tags',
        write_only=True,
        required=False
    )
    github_url = serializers.URLField(source='github', required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = Experiment
        fields = [
            'id',
            'title',
            'description',
            'github_url',
            'content',
            'tags',
            'tag_ids',
            'date',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']