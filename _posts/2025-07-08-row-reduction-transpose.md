---
layout: post
title: row reduction & matrix transpose (artin 1.2 & 1.3)
date: 2025-07-08
description: yay artin
---

This is an exposition on Sections 1.2 & 1.3 on row reduction and the matrix transpose from Artin Algebra.

## Notes on Chapter

An example of a *row operation* is left multiplication by an invertible matrix. Sometimes, you can use *elementary matrices* for these operations, which have three types of the $2\times 2$ kind:

$$\qquad (i) \begin{bmatrix} 1 & a \\ 0 & 1 \end{bmatrix} \text{ or } \begin{bmatrix} 1 & 0 \\ a & 1 \end{bmatrix}, \qquad (ii) \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}, \qquad (iii) \begin{bmatrix} c & \\ & 1 \end{bmatrix} \text{ or } \begin{bmatrix} 1 & \\ & c \end{bmatrix}.$$

Additionally, there are three main types of $n\times n$ elementary matrices, which can be found by "slicing" the $2 \times 2$ elementary matrices symetrically into an identity matrix:

Type 1: One off-diagonal entry $a$ is added to the identity matrix. Simply stated, you just place a entry above one of the numbers on the diagonals. When multiplying this elementary matrix by a matrix $X$, the result is to, for $a$ in the $i, j$ position, add $a$ of $X$ to row $i$. This is just adding the entries of one row to the entries of another row.

Type 2: The $i$-th and $j$-th diagonal entries of the identity matrix are replaced with a zero, and the 1's are added in the $(i,j)$ and $(j,i)$ positions. Simply stated, in the middle, you make a $2\times 2$ square with corners alternating $0$'s and $1$'s with a $1$ in the middle. Generally, you choose two arbritrary rows of the matrix and swap them.

Type 3: One diagonal entry of the identity matrix is replaced by a nonzero scalar $c$. Simply stated, one of the numbers on a diagonal is replaced with the scalar $c$. When multiplying this elementary matrix by a matrix $X$, the result is to multiply row $i$ of $X$ by a nonzero scalar $c$.

__Lemma.__ Elementary matrices are invertible, and their inverses are also elementary matrices.

_Proof._ We have that the inverse of an elementary matrix is just the matrix corresponding to the inverse row operation "substract $a\cdot$ (row $j$) from (row $i$)", "interchange (row $i$) and (row $j$) again, or "multiply (row $i$) by $c^{-1}$, as desired. $\square$

Thus, we aim to perform a series of elementary row operations above on a matrix $M$ to end up with a simpler matrix:

$$M \rightarrow \rightarrow \dots \rightarrow M',$$

where $M'$ is the final simpler matrix, and the arrows represent elementary operations. Note that every elementary operation is gotten by multiplying the elementary matrix, so we can rewrite the above as such:

$$M' = E_k \dots E_2 E_2 M,$$

where $E_1,\dots, E_k$ is the sequence of elementary matrices. This is called _row reduction_, because we are simplifying the matrix.

We can use row operations to help us solve systems of linear equations. We can represent a system of $m$ equations over $n$ variables as $AX=B$, where $A$ is the set of coefficients, and $B$ is the set of numbers equal to the expressions on the left-hand side. We can solve this using a so-called _augmented matrix_ with dimensions $m \times (n+1),$ shown below:

$$M = [A|B] = \left[ \begin{array}{ccc|c} a_{11} & \dots & a_{1n} & b_1 \\ \vdots & & \vdots & \vdots \\ a_{m1} & \dots & a_{mn} & b_n \end{array} \right].$$

We perform a sequence of row operations to take $M \rightarrow M'$, or $[A \mid B] \rightarrow [A' \mid B'].$ This follows due to the following proposition.

__Proposition.__ The systems $A'X = B$ and $AX = B$ have the same solutions.

_Proof._ Set $P:= E_1\dots E_n,$ the row operations acting on $M$. Thus, it follows that $M' = PM.$ The rest follows easily. $\square$

__Remark.__ Choosing some $c := x_n$, where $x_n$ was one of the varaibles, works nice to solve stuff.

We can reduce a matrix $M$ to a _row echelon matrix_ through a sequence of matrix operations that satisfies the following properties:

(a) If a row is $0$, then all the rows below it is also $0$.

(b) If a row is not $0$, then it's first nonzero entry is a $1$, called a _pivot_.

(c) If a row below another row is not $0$, then the pivot on that row is to the right of the pivot of the row above it.

(d) The entries above a pivot are all $0$.

It follows that every row has a pivot, and the location of the pivot goes to the right as we move down the matrix.

__Proposition.__ A systems of equations $A'X = B'$ has a solution if and only if there is no pivot in the last column.

Every _homogeneous_ linear equation $AX=0$ has the _trivial_ solution $X=0$. If there are more unknowns than equations, then $AX=0$ has a _nontrival_ solution.

__Corollary__ We alkso have that every system $AX=0$ with $m$ homogeneous equations with $n$ variables for $m < n$ has a solution $X$ for which $x_i$ is nonzero.

_Proof._ The proof hinges on the fact that $A'X = 0$ has the same number of solutions, so the number of pivots is at more $m$, and thus less than $n$, hence the corollary follows. $\square$

__Lemma.__ A square echelon matrix $M$ is either the identity matrix $I$, or its bottom row is zero.

_Proof._ Assume $M$ is a $n\times n$ echelon matrix. Then, since there are $n$ columns, there are at most $n$ pivots. If there are $n$ pivots, then there is one in each column, so $M=I$, otherwise, some row is $0$, so the bottom row is also $0$. $\square$

We have that the following three statements are equal for some square matrix $A$ (but we will not prove this):

(a) $A$ can be reduced to the identity by a sequence of elementary row operations.

(b) $A$ is a product of elementary matrices.

(c) $A$ is invertible.

__Example (Artin).__ We can invert the matrix $A = \begin{bmatrix} 1 & 5 \\ 2 & 6 \end{bmatrix}$. To do this, we form the $2 \times 4$ block matrix

$$
[A|I] = \left[ \begin{array}{cc|cc}
1 & 5 & 1 & 0 \\
2 & 6 & 0 & 1
\end{array} \right].
$$
We perform row operations to reduce $A$ to the identity, carrying the right side along, and thereby end up with $A^{-1}$ on the right.

__Theorem__ the following for a square matrix $A$ are equal:

(a) $A$ is invertible.

(b) $AX=B$ has a unique solution for every column vector $B.$

(c) $AX=0$ has only $X=0$ as its solution.

Note that thus far, we have only worked with operations on the rows of a matrix, but what about the columns? One can deduce that they will have similar properties. We call the _transpose_ of a $m\times n$ matrix $A$ as the $n \times m$ matrix $A^{\text{t}}$ such that we just reflect $A$ along its diagonal. So, $A^{\text{t}} = (b_{ij})$, where $b_{ij} = a_{ji}.$ For example:

$$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}^t = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix} \quad \text{and} \quad \begin{bmatrix} 1 & 2 & 3 \end{bmatrix}^t = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}.$$

We have that for a transpose of two matrices $A$ and $B$, the following hold.

$$(AB)^{\text{t}} = B^{\text{t}}A^{\text{t}}, (A+B)^{\text{t}},  (cA)^{\text{t}} = cA^{\text{t}}, (A^{\text{t}})^{\text{t}}=A.$$

We use _right multiplication_ instead of the _left multiplication_ used before to deduce that we can have _elementary column operations_ that are similar to the row operations, except the indices $i, j$ are reversed.
