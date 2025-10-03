export const Path = {
    Root: "/",
    Clothes: "/clothes",
    Login: "/auth/login",
    Register: "/auth/register",
    Admin: {
        index: "/admin",
        children: {
            dashBoard: "/admin/dashboard",
            question: "/admin/questions"
        }
    },
    PageNotFound: "/page-not-found",
    PermissionDenied: "/permission-denied",
    Conversation: "/conversation",
};