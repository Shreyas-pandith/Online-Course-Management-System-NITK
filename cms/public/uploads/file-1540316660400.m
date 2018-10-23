function findPrimes(n) 

    prime = isPrime(n);
    if prime == 1
        fprintf("%i\n", n);
    end
    
    prime = isPrime(n-2);
    if prime == 1
        fprintf("%i  %i\n", 2,n-2);
    else
        i = 0;
        while i < n
            if isPrime(i) && isPrime(n-i)
                fprintf("%i  %i\n", i,n-i);
                break;
            end
            i = i+1;
        end
    end
 end