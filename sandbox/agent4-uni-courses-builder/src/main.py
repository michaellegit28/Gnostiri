#!/usr/bin/env python3
"""Agent 4: University Courses Builder"""
import sys
import json

def build_course_outline(title, lessons_str, code=None, course_number=None, year=None, term=None, credits=None, faculty=None, department=None):
    """Generate rich course structure with US-style academic naming"""
    lessons = []
    for i, l in enumerate([x.strip() for x in lessons_str.split(",") if x.strip()], start=1):
        lessons.append({
            "title": l,
            "orderIndex": i,
            "estimatedMinutes": 30,
            "reviewStatus": "needs-human-review"
        })
    
    # US academic level mapping
    year_label = None
    if year:
        try:
            y = int(year)
            year_map = {1: "Freshman", 2: "Sophomore", 3: "Junior", 4: "Senior"}
            year_label = year_map.get(y, f"Year {y}")
        except ValueError:
            year_label = str(year)

    # Normalize term to US terms
    term_norm = None
    if term:
        t = term.lower()
        if t in ("fall", "spring", "summer"):
            term_norm = t.capitalize()
        else:
            term_norm = term

    outline = {
        "domain": "university",
        "track": ["global"],
        "isGlobal": True,
        "style": "US",
        "title": title,
        "courseCode": code,
        "courseNumber": course_number,
        "academicYear": int(year) if year and str(year).isdigit() else None,
        "academicYearLabel": year_label,
        "term": term_norm,
        "credits": int(credits) if credits and str(credits).isdigit() else None,
        "faculty": faculty,
        "department": department,
        "lessons": lessons,
        "totalLessons": len(lessons),
        "status": "draft",
        "isLive": False,
        "hasContent": len(lessons) > 0,
        "visibilityNote": "Internal draft only. Not advertised to students until reviewed and published."
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
        print("Usage: python src/main.py <course_title> <lessons_comma_separated> [code=CODE] [course_number=101] [year=1] [term=Fall] [credits=3] [faculty=FacultySlug] [department=Dept]")
        sys.exit(1)
    
    title, lessons, kwargs = parsed
    result = build_course_outline(
        title,
        lessons,
        code=kwargs.get("code"),
        course_number=kwargs.get("course_number"),
        year=kwargs.get("year"),
        term=kwargs.get("term"),
        credits=kwargs.get("credits"),
        faculty=kwargs.get("faculty"),
        department=kwargs.get("department")
    )
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()