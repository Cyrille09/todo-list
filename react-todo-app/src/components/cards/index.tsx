import classnames from "classnames";

// style components
import styles from "./cards.module.scss";
import "./box-shadow-card.scss";

interface KeyValueCardProps {
  title: any;
  subTitle?: any;
  filter?: any;
  vButton?: any;
  pButton?: any;
  cButton?: any;
  children?: any;
  headerStyle?: any;
}

export const KeyValueCard = ({
  title,
  subTitle,
  filter,
  vButton,
  pButton,
  cButton,
  children,
  headerStyle,
}: KeyValueCardProps) => {
  return (
    <div className="card">
      <div className={classnames("card-header")} style={headerStyle}>
        <div className="row">
          <div className="col-md-3 mb-2 mb-md-0 d-flex flex-column">
            <h3 className="mb-0">{title}</h3>
            {subTitle && <p className="card-subtitle mt-1">{subTitle}</p>}
          </div>

          <div className="col-md-9 d-grid d-sm-flex justify-content-md-end align-items-sm-center gap-4">
            {filter && <div className={styles.filter}>{filter}</div>}
            {vButton && (
              <a
                href="##"
                className={classnames("text-muted", filter && styles.vButton)}
              >
                {vButton}
              </a>
            )}
            {pButton && <div className={styles.pButton}>{pButton}</div>}
            {cButton && <div className={styles.cButton}>{cButton}</div>}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export const RowCard = ({ children, className = "" }: any) => {
  return (
    <div className={`${styles.row} ${className}`}>
      <div className={styles.value}>{children}</div>
    </div>
  );
};

export const BoxShadowCard = ({
  children,
  className,
}: {
  children: any;
  className?: any;
}) => {
  return (
    <div className={classnames("box-shadow-main", className)}>
      <div>{children}</div>
    </div>
  );
};
