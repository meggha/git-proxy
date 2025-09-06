#include <stdio.h>
#include <stdlib.h>
#include <omp.h>
#include <stdbool.h>

// Function to check if a number is prime
bool is_prime(int num) {
    if (num < 2) return false;
    if (num == 2) return true;
    if (num % 2 == 0) return false;
    for (int i = 3; i * i <= num; i += 2) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int N;
    printf("Enter the value of N: ");
    scanf("%d", &N);

    if (N < 2) {
        printf("No prime numbers in the given range.\n");
        return 0;
    }

    int *primes = (int *)malloc(N * sizeof(int));
    int count = 0;

    #pragma omp parallel for schedule(dynamic)
    for (int i = 2; i <= N; i++) {
        if (is_prime(i)) {
            #pragma omp critical
            {
                primes[count++] = i;
            }
        }
    }

    printf("Prime numbers up to %d:\n", N);
    for (int i = 0; i < count; i++) {
        printf("%d ", primes[i]);
    }
    printf("\n");

    free(primes);
    return 0;
}
