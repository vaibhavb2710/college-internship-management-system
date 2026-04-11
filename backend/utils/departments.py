"""Department normalization helpers.

The product targets these canonical departments:
CMPN, INFT, EXTC, EXCS, BIOMED.
"""

from typing import Dict, List, Set


CANONICAL_DEPARTMENTS: List[str] = ["CMPN", "INFT", "EXTC", "EXCS", "BIOMED"]

_DEPARTMENT_ALIASES: Dict[str, Set[str]] = {
    "CMPN": {
        "CMPN",
        "CSE",
        "COMPUTER ENGINEERING",
        "COMPUTER",
    },
    "INFT": {
        "INFT",
        "IT",
        "INFORMATION TECHNOLOGY",
    },
    "EXTC": {
        "EXTC",
        "ECE",
        "ELECTRONICS ENGINEERING",
        "ELECTRONICS",
        "ELECTRONICS & COMMUNICATION",
        "ELECTRONICS AND COMMUNICATION",
        "ELECTRONICS & TELECOMMUNICATION",
        "ELECTRONICS AND TELECOMMUNICATION",
    },
    "EXCS": {
        "EXCS",
        "CSED",
        "CS",
        "COMPUTER SCIENCE",
        "COMPUTER SCIENCE & ENGINEERING",
        "COMPUTER SCIENCE AND ENGINEERING",
    },
    "BIOMED": {
        "BIOMED",
        "BIO",
        "BIOTECHNOLOGY",
        "BIOMEDICAL",
        "BIOMEDICAL ENGINEERING",
    },
}

_ALIAS_TO_CANONICAL: Dict[str, str] = {}
for canonical, aliases in _DEPARTMENT_ALIASES.items():
    for alias in aliases:
        _ALIAS_TO_CANONICAL[alias.upper()] = canonical


def normalize_department(department: str) -> str:
    """Return canonical department code when possible."""
    if not department:
        return ""
    cleaned = str(department).strip().upper()
    return _ALIAS_TO_CANONICAL.get(cleaned, cleaned)


def get_department_aliases(department: str) -> List[str]:
    """Return all aliases matching a department, including canonical code."""
    canonical = normalize_department(department)
    if not canonical:
        return []
    aliases = set(_DEPARTMENT_ALIASES.get(canonical, {canonical}))
    aliases.add(canonical)
    return sorted(aliases)

