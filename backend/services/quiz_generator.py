import random
from typing import List, Dict

# Knowledge Base for Quizzes
QUESTION_BANK = {
    "python": [
        {"question": "What is the correct file extension for Python files?", "option_a": ".py", "option_b": ".pt", "option_c": ".pyt", "option_d": ".pth", "correct_option": "a"},
        {"question": "Which keyword is used to create a function in Python?", "option_a": "function", "option_b": "def", "option_c": "fun", "option_d": "define", "correct_option": "b"},
        {"question": "What is a correct syntax to output 'Hello World' in Python?", "option_a": "echo 'Hello World'", "option_b": "p('Hello World')", "option_c": "print('Hello World')", "option_d": "Console.Log('Hello World')", "correct_option": "c"},
        {"question": "Which collection is ordered, changeable, and allows duplicate members?", "option_a": "Tuple", "option_b": "Set", "option_c": "Dictionary", "option_d": "List", "correct_option": "d"},
        {"question": "How do you insert comments in Python code?", "option_a": "//", "option_b": "#", "option_c": "/*", "option_d": "--", "correct_option": "b"},
        {"question": "Which operator is used for exponentiation?", "option_a": "^", "option_b": "**", "option_c": "exp", "option_d": "power", "correct_option": "b"},
        {"question": "What is the output of: print(bool(0))?", "option_a": "True", "option_b": "False", "option_c": "None", "option_d": "Error", "correct_option": "b"},
    ],
    "react": [
        {"question": "What is the command to create a new React app?", "option_a": "npm new react-app", "option_b": "npx create-react-app", "option_c": "npm install react", "option_d": "npx new-react", "correct_option": "b"},
        {"question": "Which hook is used to handle side effects?", "option_a": "useState", "option_b": "useEffect", "option_c": "useReducer", "option_d": "useContext", "correct_option": "b"},
        {"question": "What syntax extension does React use?", "option_a": "XML", "option_b": "JSX", "option_c": "HTML", "option_d": "JS+", "correct_option": "b"},
        {"question": "how do you access props in a functional component?", "option_a": "this.props", "option_b": "props argument", "option_c": "useProps()", "option_d": "getProps()", "correct_option": "b"},
        {"question": "Which hook is used for state management?", "option_a": "useState", "option_b": "useEffect", "option_c": "useHistory", "option_d": "useRouter", "correct_option": "a"},
        {"question": "What is the virtual DOM?", "option_a": "A direct copy of the DOM", "option_b": "A lightweight copy of the DOM", "option_c": "A database", "option_d": "A browser plugin", "correct_option": "b"},
    ],
    "java": [
        {"question": "Which data type is used to create a variable that should store text?", "option_a": "String", "option_b": "Char", "option_c": "Txt", "option_d": "string", "correct_option": "a"},
        {"question": "How do you create a variable with the numeric value 5?", "option_a": "num x = 5", "option_b": "x = 5", "option_c": "int x = 5", "option_d": "float x = 5", "correct_option": "c"},
        {"question": "Which method can be used to find the length of a string?", "option_a": "getSize()", "option_b": "length()", "option_c": "len()", "option_d": "getLength()", "correct_option": "b"},
        {"question": "Which operator is used to compare two values?", "option_a": "=", "option_b": "<>", "option_c": "==", "option_d": "><", "correct_option": "c"},
        {"question": "To declare an array in Java, define the variable type with:", "option_a": "()", "option_b": "{}", "option_c": "[]", "option_d": "<>", "correct_option": "c"},
    ]
}

def generate_quiz_questions(topic: str) -> List[Dict]:
    key = topic.lower()
    
    # Try direct match or partial match
    found_key = None
    if key in QUESTION_BANK:
        found_key = key
    else:
        # Simple fallback search
        for k in QUESTION_BANK.keys():
            if k in key or key in k:
                found_key = k
                break
    
    questions = []
    if found_key:
        # Get random sample
        source_questions = QUESTION_BANK[found_key]
        questions = random.sample(source_questions, min(5, len(source_questions)))
    else:
        # Generate placeholder questions if topic is unknown
        for i in range(5):
            questions.append({
                "question": f"Question {i+1} about {topic}: What is the core concept?",
                "option_a": "Concept A",
                "option_b": "Concept B",
                "option_c": "Concept C",
                "option_d": "Concept D",
                "correct_option": "a"
            })
            
    return questions
