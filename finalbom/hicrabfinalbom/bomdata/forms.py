from django import forms
from .models import BOM, Component, Specification
MAKE_CHOICES = [
    ('------', '------'),
    ('Pusher', 'Pusher'),
    ('Cumi', 'Cumi'),
    ('Cumi (Premier)', 'Cumi (Premier)'),
    ('Dimond', 'Dimond'),
    ('Fenner', 'Fenner'),
    ('Emarco', 'Emarco'),
    ('Nu Tech', 'Nu Tech'),
    ('Lovejoy', 'Lovejoy'),
    ('Audco', 'Audco'),
    ('NTN', 'NTN'),
    ('Raicer', 'Raicer'),
    ('Legris', 'Legris'),
    ('Delta', 'Delta'),
    ('Vanaz', 'Vanaz'),
    ('Avcon', 'Avcon'),
    ('IEPL', 'IEPL'),
    ('Champion Coolers', 'Champion Coolers'),
    ('Jhonson', 'Jhonson'),
    ('Auro', 'Auro'),
    ('Bharat Bijlee', 'Bharat Bijlee'),
    ('Rossi', 'Rossi'),
    ('SMC', 'SMC'),
    ('EP', 'EP'),
    ('HICARB','HICARB'),
    ('NILL','NIL'),
    ('indian','indian'),
]
class BOMForm(forms.ModelForm):
    class Meta:
        model = BOM
        fields = ['name', 'model']

class ComponentForm(forms.ModelForm):
    class Meta:
        model = Component
        fields = ['bom', 'name']

class SpecificationForm(forms.ModelForm):
    make = forms.ChoiceField(choices=MAKE_CHOICES, required=True)
    class Meta:
        model = Specification
        fields = ['component', 'specification', 'make', 'purpose', 'quality','rate','price']
        
