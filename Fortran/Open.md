## Open
the open statement connects or reconnects an external file to an input/output unit

```Fortran
OPEN([UNIT=]${external_file_unit},IOSTAT,ERR,FILE,STATUS,ACCESS,FORM,RECL,BLANK,POSITION,ACTION,DELIM,PAD)
```

- `IOSTAT` : [INTEGER] positive if an error conditions occurs, negative if an end-of-file or end-of-record, zero otherwise

- `ERR` : 