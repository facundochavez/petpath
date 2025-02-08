import random
import requests
from django.http import JsonResponse, HttpResponse
import json

cats_file_path = 'static/cats-missed-images.json'
with open(cats_file_path) as cats_file:
    cats_missed_images = json.load(cats_file)

dogs_file_path = 'static/dogs-levels.json'
with open(dogs_file_path) as dogs_file:
    dogs_levels = json.load(dogs_file)


all_cats = []
available_cats = []
sent_cats = []
FEATURES = ['affection_level', 'adaptability', 'energy_level',
            'intelligence', 'vocalisation', 'social_needs']
EXTRA_FEATURES = ['stranger_friendly', 'child_friendly',
                'dog_friendly', 'grooming', 'health_issues','shedding_level']
THE_CAT_API_ENDPOINT = 'https://api.thecatapi.com/v1'
HEADERS = {
    'x-api-key': 'process.env.THE_CAT_API_KEY',
    }


def get_cat(request):
    global all_cats
    global available_cats
    global sent_cats

    # GETTING ARGUMENTS
    reset = request.GET.get('reset')
    get_length = request.GET.get('get_length')
    update_cats = request.GET.get('update_cats')
    selected_index = request.GET.get('selected_index')
    selected_feature = request.GET.get('selected_feature')
    selected_action = request.GET.get('selected_action')

    # FETCHING ALL CATS AT FIRST TIME
    if len(all_cats) == 0:
        response = requests.get(
            f'{THE_CAT_API_ENDPOINT}/breeds', headers=HEADERS)
        data = response.json()
        all_cats = data
        available_cats = all_cats.copy()

    # RESET FUNCTION
    if reset == 'true':
        available_cats = []
        available_cats = all_cats.copy()
        sent_cats = []
        return HttpResponse()

    # SEND ALL CATS LENGTH
    if get_length == 'true':
        return HttpResponse(len(all_cats))

    # UPDATING AVAILABLE CATS WHEN LOGIN
    if update_cats:
        update_cats_list = update_cats.split(',')
        sent_cats = []
        for id in update_cats_list:
            add_cat = next((cat for cat in all_cats if cat['id'] == id), None)
            sent_cats.append(add_cat)
        available_cats = [cat for cat in all_cats if cat not in sent_cats]
        return HttpResponse()

    # LOOKING FOR RANDOM CAT WITH A LOW SCORE IF SELECTED INDEX IS UNDEFINED (FIRST CALL)
    if selected_index == 'undefined':
        def low_scoring(cat):
            score = 0
            for feature in FEATURES:
                score += cat.get(feature)
            return score
        sorted_cats = sorted(all_cats, key=low_scoring)
        lowest_scores = sorted_cats[:15]
        randomIndex = random.randint(0, len(lowest_scores) - 1)
        cat = lowest_scores[randomIndex]

    # LOOKING FOR MAX-SCORED CAT IF SELECTED INDEX IS DEFINED
    else:
        selected_index = int(selected_index)
        selected_feature = FEATURES[int(selected_feature) - 1]

        # UPDATING sent_cats IF THE ORIGIN CAT IS NOT THE LAST SENDED
        if selected_index + 1 < len(sent_cats):
            sent_cats = sent_cats[:selected_index + 1]
            available_cats = [
                cat for cat in all_cats if cat not in sent_cats]

        # GETTING CATS THAT MEET THE REQUERIMENT
        if selected_action == '=':
            match_cats = [cat for cat in available_cats if cat.get(
                selected_feature) == sent_cats[selected_index].get(selected_feature)]
        elif selected_action == '-':
            match_cats = [cat for cat in available_cats if cat.get(
                selected_feature) < sent_cats[selected_index].get(selected_feature)]
        else:
            match_cats = [cat for cat in available_cats if cat.get(
                selected_feature) > sent_cats[selected_index].get(selected_feature)]

        # GETTING MAX-SCORED CAT
        def scoring(cat):
            score = 0
            for feature in FEATURES:
                feature_score = 5 - \
                    abs(sent_cats[selected_index].get(
                        feature) - cat.get(feature))
                score += feature_score
            return score
        cat = max(match_cats, key=scoring)

    # UPDATING SENDED AND AVAILABLE CATS
    sent_cats.append(cat)
    available_cats.remove(cat)

    # FETCHING IMAGES
    images_response = requests.get(
        f'{THE_CAT_API_ENDPOINT}/images/search?limit=5&breed_ids={cat["id"]}', headers=HEADERS)
    images_data = images_response.json()

    # ADDING MISSED IMAGES IF CAT IS IN 'CATS_MISSED_IMAGES'
    for missed_cat in cats_missed_images:
        if missed_cat['id'] == cat['id']:
            images_data.extend(missed_cat['images'])

    # BUILDING CATS TO RETURN
    new_cat = {
        'id': cat['id'],
        'name': cat['name'],
        'images': [
            {
                'id': image['id'],
                'url': image['url']
            } for image in images_data],
        'description': cat['description'],
        'fav': False,
        'selected_feature': None,
        'selected_action': None,
        'features': {},
        'extra_features': {}
    }

    # ADDING FEATURES AND ACTION ABILITIES TO CATS
    for feature in FEATURES:
        new_cat['features'][feature] = {
            'points': cat[feature],
            'plus_ability': any(available_cat.get(feature) > cat.get(feature) for available_cat in available_cats),
            'equal_ability': any(available_cat.get(feature) == cat.get(feature) for available_cat in available_cats),
            'less_ability': any(available_cat.get(feature) < cat.get(feature) for available_cat in available_cats),
        }
    for extra_feature in EXTRA_FEATURES:
        new_cat['extra_features'][extra_feature] = {
            'points': cat[extra_feature],
        }

    return JsonResponse(new_cat)
