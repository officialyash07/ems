const MENU = {
    intern: [
        "dashboard",
        "my-tasks",
        "submissions",
        "meetings",
        "chat",
        "profile",
    ],
    team_lead: ["dashboard", "tasks", "reviews", "meetings", "chat"],
    team_lead_intern: ["dashboard", "intern-tasks", "reviews", "meetings", "chat"],
    manager: ["dashboard", "analytics", "reports", "meetings", "chat"],
    manager_intern: ["dashboard", "intern-analytics", "reports", "intern-meetings", "chat","review-submissions",],
    admin: ["dashboard", "users", "chat", "settings"],
    // COO Panel Added Below
    coo: [
        "dashboard",
        "organization",
        "analytics",
        "meetings",
        "reports",
        "chat",
        "settings",
    ],
    cxo: [
        "dashboard",
        "organization",
        "analytics",
        "reports",
        "chat",
        "settings",
    ],
    ceo: [
        "dashboard",
        "technical",
        "operations",
        "finance",
        "meetings",
        "analytics",
        "reports",
        "announcements",
        "chat",
        "settings",
    ],
};

export { MENU };
export default MENU;
