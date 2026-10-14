#include <stdio.h>
#include <string.h>

struct user {
    char name[8];   /* the 8-slot box */
    int  is_admin;  /* the flag right behind it; 0 means not an admin */
};

int main(int argc, char **argv) {
    struct user u;
    u.is_admin = 0;
    if (argc < 2) return 1;

    strcpy(u.name, argv[1]);   /* no length check */

    printf("name     = %s\n", u.name);
    printf("is_admin = %d\n", u.is_admin);
    if (u.is_admin)
        puts("-> admin page");
    else
        puts("-> ordinary user");
    return 0;
}
