# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

import openai
import requests
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher

class ActionGPTResponse(Action):
    def name(self):
        return "action_gpt_response"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        # Get the latest message
        user_message = tracker.latest_message.get('text')

        # Use OpenAI API for decision-making
        openai.api_key = "your-openai-api-key"
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_message}]
        )

        # Get the model's response and send it to the user
        bot_reply = response['choices'][0]['message']['content']
        dispatcher.utter_message(text=bot_reply)

        return []



class ActionGetOrderStatus(Action):
    def name(self):
        return "action_get_order_status"

    def run(self, dispatcher, tracker, domain):
        order_id = tracker.get_slot("order_id")
        if order_id:
            response = requests.get(f"http://your-crm-api.com/orders/{order_id}")
            status = response.json().get("status", "Unknown")
            dispatcher.utter_message(text=f"Order {order_id} status: {status}")
        else:
            dispatcher.utter_message(text="I couldn't find that order.")
        return []

