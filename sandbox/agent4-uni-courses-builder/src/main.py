#!/usr/bin/env python3
"""Agent 4: University Courses Builder"""
import sys
import json

def build_course_outline(title, lessons_str, code=None, level=None, credits=None, faculty=None, semester=None, department=None):
    """Generate rich course structure"""
    lessons = []
    for i, l in enumerate([x.strip() for x in lessons_str.split(",") if x.strip()], start=1):
        lessons.append({
            "title": l,
            "orderIndex": i,
            "estimatedMinutes": 30,
            "reviewStatus": "needs-human-review"
        })
    
    outline = {
        "title": title,
        "code": code,
        "level": int(level) if level and level.isdigit() else None,
        "credits": int(credits) if credits and credits.isdigit() else None,
        "faculty": faculty,
        "semester": semester,
        "department": department,
        "lessons": lessons,
        "totalLessons": len(lessons)
    }
    # Remove None values for cleaner output
    outline = {k: v for k, v in outline.items() if v is not None}
    return outline

def parse_args(args):
    if len(args) < 2:
        return None
    title = args[0]
    lessons = args[1]
    kwargs = {}
    for a in args[2:]:
        if "=" in a:
            k, v = a.split("=", 1)
            kwargs[k.lower()] = v
    return title, lessons, kwargs

def main():
    args = sys.argv[1:]
    parsed = parse_args(args)
    if not parsed:
        print("Usage: python src/main.py <course_title> <lessons_comma_separated> [code=CODE] [level=100] [credits=3] [faculty=FacultySlug] [semester=first] [department=Dept]")
        sys.exit(1)
    
    title, lessons, kwargs = parsed
    result = build_course_outline(
        title,
        lessons,
        code=kwargs.get("code"),
        level=kwargs.get("level"),
        credits=kwargs.get("credits"),
        faculty=kwargs.get("faculty"),
        semester=kwargs.get("semester"),
        department=kwargs.get("department")
    )
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()