import { ReactElement } from "react";

export const Card = (props: {children?: ReactElement[] | ReactElement, className?: string}) => {
  return (
    <div className={"bg-green-300 rounded-xl p-4 " + props.className}>
      {props.children}
    </div>
  )
}