from typing import List, Dict
import math

# Knowledge base for common topics
TOPIC_KNOWLEDGE_BASE = {
    "python": [
        "Variables & Data Types", "Control Flow (If/Else, Loops)", "Functions & Modules",
        "Data Structures (Lists, Dicts)", "File Handling", "OOP Concepts",
        "Error Handling", "Libraries (NumPy, Pandas)", "Web Scraping Basics",
        "API Basics", "Database Interaction", "Final Project"
    ],
    "react": [
        "JSX & Components", "Props & State", "Hooks (useState, useEffect)",
        "Event Handling", "Forms & Validation", "React Router",
        "Context API", "Redux Basics", "API Integration",
        "Performance Optimization", "Testing", "Deployment"
    ],
    "java": [
        "Syntax & Variables", "Control Structures", "OOP: Classes & Objects",
        "Inheritance & Polymorphism", "Interfaces & Abstract Classes", "Collections Framework",
        "Exception Handling", "File I/O", "Multithreading",
        "JDBC Basics", "Spring Boot Intro", "Final Project"
    ],
    "javascript": [
        "Variables (let/const)", "Data Types & Operators", "Functions (Arrow functions)",
        "DOM Manipulation", "Events", "Async/Await & Promises",
        "ES6+ Features", "Fetch API", "Modules",
        "Local Storage", "Classes", "Project Work"
    ]
}

def generate_schedule(topic: str, days: int, hours_per_day: int) -> Dict:
    topic_key = topic.lower()
    
    # Get topics or generate generic ones
    if topic_key in TOPIC_KNOWLEDGE_BASE:
        base_topics = TOPIC_KNOWLEDGE_BASE[topic_key]
    else:
        base_topics = [f"{topic} Fundamentals {i+1}" for i in range(12)]

    # Calculate phases
    total_hours = days * hours_per_day
    
    # Define phase distribution (approximate)
    # Phase 1: Basics (30%)
    # Phase 2: Core/Deep Dive (40%)
    # Phase 3: Advanced/Project (30%)
    
    phase1_days = math.ceil(days * 0.3)
    phase2_days = math.ceil(days * 0.4)
    # Remainder for phase 3
    phase3_days = days - phase1_days - phase2_days
    
    schedule = []
    
    # Helper to get topic index
    def get_topic(day_idx, total_days_in_phase, phase_topics_start, phase_topics_end):
        # Map day progress to topic index range
        progress = day_idx / total_days_in_phase
        topic_idx = phase_topics_start + int(progress * (phase_topics_end - phase_topics_start))
        if topic_idx >= len(base_topics):
            topic_idx = len(base_topics) - 1
        return base_topics[topic_idx]

    # Generate Schedule
    current_day = 1
    
    # Phase 1
    for i in range(phase1_days):
        topic_name = get_topic(i, phase1_days, 0, len(base_topics) // 3)
        schedule.append({
            "day": current_day,
            "phase": "Fundamentals",
            "topic": topic_name,
            "hours": hours_per_day,
            "activity": "Read docs & practice basic syntax"
        })
        current_day += 1
        
    # Phase 2
    for i in range(phase2_days):
        topic_name = get_topic(i, phase2_days, len(base_topics) // 3, 2 * len(base_topics) // 3)
        schedule.append({
            "day": current_day,
            "phase": "Deep Dive",
            "topic": topic_name,
            "hours": hours_per_day,
            "activity": "Build small components/scripts"
        })
        current_day += 1
        
    # Phase 3
    for i in range(phase3_days):
        topic_name = get_topic(i, phase3_days, 2 * len(base_topics) // 3, len(base_topics))
        schedule.append({
            "day": current_day,
            "phase": "Advanced & Projects",
            "topic": topic_name,
            "hours": hours_per_day,
            "activity": "Final Project implementation"
        })
        current_day += 1
        
    return {
        "course_name": topic,
        "total_days": days,
        "hours_per_day": hours_per_day,
        "total_hours": total_hours,
        "schedule": schedule
    }
