#!/usr/bin/env python3
"""Seed core university courses – honest draft only"""
import json

CORE_COURSES = [
    {
        "domain": "university",
        "track": ["global"],
        "isGlobal": True,
        "style": "US",
        "title": "Gross Anatomy I — Upper Limb & Thorax",
        "courseCode": "ANA 101",
        "courseNumber": "101",
        "academicYear": 1,
        "academicYearLabel": "Freshman",
        "term": "Fall",
        "credits": 4,
        "faculty": "Clinical Medicine",
        "department": "Human Anatomy",
        "status": "draft",
        "isLive": False,
        "hasContent": False,
        "visibilityNote": "Internal draft only. Not advertised to students until reviewed and published."
    },
    {
        "domain": "university",
        "track": ["global"],
        "isGlobal": True,
        "style": "US",
        "title": "Human Physiology I — Cell & General",
        "courseCode": "PHS 101",
        "courseNumber": "101",
        "academicYear": 1,
        "academicYearLabel": "Freshman",
        "term": "Fall",
        "credits": 3,
        "faculty": "Basic Medical Sciences",
        "department": "Physiology",
        "status": "draft",
        "isLive": False,
        "hasContent": False,
        "visibilityNote": "Internal draft only. Not advertised to students until reviewed and published."
    },
    {
        "domain": "university",
        "track": ["global"],
        "isGlobal": True,
        "style": "US",
        "title": "Medical Biochemistry I — Cell Chemistry & Proteins",
        "courseCode": "MCB 101",
        "courseNumber": "101",
        "academicYear": 1,
        "academicYearLabel": "Freshman",
        "term": "Fall",
        "credits": 3,
        "faculty": "Basic Medical Sciences",
        "department": "Medical Biochemistry",
        "status": "draft",
        "isLive": False,
        "hasContent": False,
        "visibilityNote": "Internal draft only. Not advertised to students until reviewed and published."
    },
    {
        "domain": "university",
        "track": ["global"],
        "isGlobal": True,
        "style": "US",
        "title": "Introduction to Computer Science",
        "courseCode": "CS 101",
        "courseNumber": "101",
        "academicYear": 1,
        "academicYearLabel": "Freshman",
        "term": "Fall",
        "credits": 3,
        "faculty": "Computing & AI",
        "department": "Computer Science",
        "status": "draft",
        "isLive": False,
        "hasContent": False,
        "visibilityNote": "Internal draft only. Not advertised to students until reviewed and published."
    },
    {
        "domain": "university",
        "track": ["global"],
        "isGlobal": True,
        "style": "US",
        "title": "Introduction to Psychology",
        "courseCode": "SOC 101",
        "courseNumber": "101",
        "academicYear": 1,
        "academicYearLabel": "Freshman",
        "term": "Fall",
        "credits": 3,
        "faculty": "Social Sciences",
        "department": "Psychology",
        "status": "draft",
        "isLive": False,
        "hasContent": False,
        "visibilityNote": "Internal draft only. Not advertised to students until reviewed and published."
    }
]

if __name__ == "__main__":
    print(json.dumps(CORE_COURSES, indent=2))
