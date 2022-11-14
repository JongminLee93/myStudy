# OpenMPI

### run MPMD MPI job
```bash
mpirun -np 2 a.out : -np 2 b.out
```
This will launch a single parallel application, but the first two processes will be instances of the a.out executable, and the second two processes will be instances of the b.out executable.   
In MPI terms, in a single MPI_COMM_WORLD, a.out processes will be ranks 0 and 1, while b.out processes will be ranks 2 and 3.

