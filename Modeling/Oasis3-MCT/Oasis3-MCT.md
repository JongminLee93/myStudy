
## OASIS3-MCT API

1. Module to use

2. Initialisation

```Fortran
CALL oasis_init_comp (compid, comp_name, ierror, coupled)
```

```Fortran
CALL oasis_get_localcomm (local_comm, ierror)
! return the value of communicators
```

MPI_INIT으로 만들어진 커뮤니케이터의 식별코드값(= value of communicators)을 oasis에서 인식할 수 있도록 불러옴

