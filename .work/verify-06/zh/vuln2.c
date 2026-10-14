#include <stdio.h>
#include <string.h>

int main(int argc, char **argv) {
    char name[8];              /* 8 格的收納盒 */
    if (argc < 2) return 1;

    strcpy(name, argv[1]);     /* 沒檢查長度 */

    printf("name = %s\n", name);
    return 0;
}
