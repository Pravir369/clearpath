from models.schemas import CatchTwoStatus

CATCH_TWO_AGENCIES = {
    "Fulton County, GA": {
        "agency_name": "Fulton County DFCS — ID Without Address Program",
        "address": "40 Marietta St NW, Atlanta, GA 30303",
        "hours": "Monday–Friday 8:00 AM – 4:00 PM",
        "docs_needed": ["Release paperwork", "SSN card", "Birth certificate", "Shelter letter"],
    }
}


def get_catch_two_status(client) -> CatchTwoStatus:
    agency = CATCH_TWO_AGENCIES.get(client.county)
    if not agency:
        return CatchTwoStatus(has_catch_two=False)
    return CatchTwoStatus(has_catch_two=True, **agency)
