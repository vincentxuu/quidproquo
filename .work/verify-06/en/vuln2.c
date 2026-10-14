#include <stdio.h>
#include <string.h>

int main(int argc, char **argv) {
    char name[8];              /* the 8-slot box */
    if (argc < 2) return 1;

    strcpy(name, argv[1]);     /* no length check */

    printf("name = %s\n", name);
    return 0;
}
