const MENU = {
    intern: [
        "dashboard",
        "my-tasks",
        "submissions",
        "meetings",
        "chat",
        "profile",
    ],
    team_lead: ["dashboard", "intern-tasks", "reviews", "meetings", "chat"],
    manager: [
        { path: "dashboard", label: "Dashboard" },
        { path: "analytics", label: "Analytics" },
        { path: "reports", label: "Reports" },
        { path: "meetings", label: "Meetings" },
        { path: "chat", label: "Chat" },
    ],
    admin: ["dashboard", "users", "settings"],
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
