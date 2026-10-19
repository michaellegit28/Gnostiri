"""Database schema for shared entities"""

class QuestionSchema:
    def __init__(self):
        self.required_fields = [
            "id", "coreId", "questionText", 
            "options", "correctAnswer"
        ]