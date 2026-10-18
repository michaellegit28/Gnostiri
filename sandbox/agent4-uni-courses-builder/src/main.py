#!/usr/bin/env python3
"""Agent 4: University Courses Builder"""
import sys

def build_course_outline(title, lessons):
    """Generate course structure"""
    return {"title": title, "lessons": lessons.split(","), "total": len(lessons.split(","))}

def main():
    args = sys.argv[1:]
    if len(args) < 2:
        print("Usage: python src/main.py <course_title> <lessons_comma_separated>")
        sys.exit(1)
    
    result = build_course_outline(args[0], args[1])
    print(result)

if __name__ == "__main__":
    main()