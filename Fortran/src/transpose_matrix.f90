program name
  implicit none
  
  INTEGER,DIMENSION(12) :: a = [1,2,3,4,5,6,11,12,13,14,15,16]

  INTEGER,DIMENSION(2,2,3) :: b1, b2, b3

  INTEGER :: i,j,k,t

  t = 0
  do j = 1,2
    do i = 1,2
      do k = 1,3
        t = t+1
        b1(i,j,k) = a(t)
      end do
    end do
  end do

  do k = 1,3
    print*,b1(:,:,k)
  end do
  
  b2 = reshape(a,shape=[2,2,3], order=[3,1,2])

  do k = 1,3
    print*,b2(:,:,k)
  end do
end program name