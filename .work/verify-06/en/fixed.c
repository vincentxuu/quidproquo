#include <stdio.h>
#include <string.h>

struct user {
    char name[8];
    int  is_admin;
};

int main(int argc, char **argv) {
    struct user u;
    u.is_admin = 0;
    if (argc < 2) return 1;

    if (strlen(argv[1]) >= sizeof u.name) {   /* check length first; reject if too long */
        puts("name too long, rejected");
        return 1;
    }
    snprintf(u.name, sizeof u.name, "%s", argv[1]);   /* even if the check were missing, at most 8 slots are written */

    printf("name     = %s\n", u.name);
    printf("is_admin = %d\n", u.is_admin);
    if (u.is_admin)
        puts("-> admin page");
    else
        puts("-> ordinary user");
    return 0;
}
