#include <stdio.h>
#include <stdlib.h>

int g_counter = 42;                 /* a global variable */

void inner(void) {
    int in_local = 3;
    printf("inner : in_local at %p\n", (void *)&in_local);
    printf("inner : return address %p\n", __builtin_return_address(0));
}

void outer(void) {
    int out_local = 2;
    printf("outer : out_local at %p\n", (void *)&out_local);
    printf("outer : return address %p\n", __builtin_return_address(0));
    inner();
    printf("outer : inner() returned, carrying on\n");
}

int main(void) {
    int main_local = 1;
    int *on_heap = malloc(sizeof(int));
    *on_heap = 99;

    printf("main  : function main  lives at %p\n", (void *)main);
    printf("main  : function outer lives at %p\n", (void *)outer);
    printf("main  : function inner lives at %p\n", (void *)inner);
    printf("main  : global g_counter at %p\n", (void *)&g_counter);
    printf("main  : main_local at %p\n", (void *)&main_local);
    printf("main  : malloc returned %p\n", (void *)on_heap);
    outer();
    printf("main  : outer() returned\n");
    free(on_heap);
    return 0;
}
