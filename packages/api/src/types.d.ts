type RequiredProperty<T> = { [P in keyof T]: Required<NonNullable<T[P]>> }
type IfTrueElseNever<T extends boolean, U> = T extends true ? U : never
