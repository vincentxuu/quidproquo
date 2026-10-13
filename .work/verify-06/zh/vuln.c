#include <stdio.h>
#include <string.h>

struct user {
    char name[8];   /* 8 格的收納盒 */
    int  is_admin;  /* 緊鄰在後面的旗標，0 代表不是管理員 */
};

int main(int argc, char **argv) {
    struct user u;
    u.is_admin = 0;
    if (argc < 2) return 1;

    strcpy(u.name, argv[1]);   /* 沒檢查長度 */

    printf("name     = %s\n", u.name);
    printf("is_admin = %d\n", u.is_admin);
    if (u.is_admin)
        puts("-> 進入管理員頁面");
    else
        puts("-> 一般使用者");
    return 0;
}
