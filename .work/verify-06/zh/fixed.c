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

    if (strlen(argv[1]) >= sizeof u.name) {   /* 先檢查長度，太長就拒絕 */
        puts("名字太長，拒絕");
        return 1;
    }
    snprintf(u.name, sizeof u.name, "%s", argv[1]);   /* 就算漏檢查，最多也只寫 8 格 */

    printf("name     = %s\n", u.name);
    printf("is_admin = %d\n", u.is_admin);
    if (u.is_admin)
        puts("-> 進入管理員頁面");
    else
        puts("-> 一般使用者");
    return 0;
}
