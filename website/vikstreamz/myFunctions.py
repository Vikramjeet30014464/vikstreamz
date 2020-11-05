# from .models import Categories4LiveTv
#
#
# def _return_Choices_for_Categories4LiveTv():
#     _temp1 = Categories4LiveTv.objects.all().values_list("Category")
#     _Categories4LiveTv = []
#     for catgory in _temp1:
#         _Categories4LiveTv.append((catgory[0][:3].upper(), catgory[0]))
#     return _Categories4LiveTv