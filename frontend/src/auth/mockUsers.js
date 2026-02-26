import { ROLES } from "./roles";

const mockUsers = [
    { email: "intern@ems.com", role: ROLES.INTERN },
    { email: "tl@ems.com", role: ROLES.TL },
    { email: "tlintern@ems.com", role: ROLES.TLINTERN },
    { email: "manager@ems.com", role: ROLES.MANAGER },
    { email: "admin@ems.com", role: ROLES.ADMIN },
    { email: "cto@ems.com", role: ROLES.CTO },
    { email: "cfo@ems.com", role: ROLES.CFO },
    { email: "coo@ems.com", role: ROLES.COO },
    { email: "ceo@ems.com", role: ROLES.CEO },

];

export { mockUsers };
export default mockUsers;
