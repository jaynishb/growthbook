import { FC, useState } from "react";
import LoadingOverlay from "../LoadingOverlay";
import DataSourceForm from "./DataSourceForm";
import { DataSourceInterfaceWithParams } from "back-end/types/datasource";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { useDefinitions } from "../../services/DefinitionsContext";
import Link from "next/link";
import { datetime } from "../../services/dates";

const DEFAULT_DATA_SOURCE: Partial<DataSourceInterfaceWithParams> = {
  type: "redshift",
  name: "My Datasource",
  params: {
    port: 5439,
    database: "",
    host: "",
    password: "",
    user: "",
    defaultSchema: "",
  },
  settings: {},
};

const DataSources: FC = () => {
  const [edit, setEdit] = useState<Partial<DataSourceInterfaceWithParams>>(
    null
  );

  const router = useRouter();

  const { datasources, error, mutateDefinitions, ready } = useDefinitions();

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  if (!ready) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      {datasources.length > 0 ? (
        <table className="table appbox table-hover">
          <thead>
            <tr>
              <th>Display Name</th>
              <th>Type</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {datasources.map((d, i) => (
              <tr
                className="nav-item"
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/datasources/${d.id}`);
                }}
              >
                <td>
                  <Link href={`/datasources/${d.id}`}>{d.name}</Link>
                </td>
                <td>{d.type}</td>
                <td>{datetime(d.dateCreated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <p>
            Connect Growth Book to your data so we can automatically fetch
            experiment results and metric values. We currently support{" "}
            <strong>Redshift</strong>, <strong>Snowflake</strong>,{" "}
            <strong>BigQuery</strong>, <strong>ClickHouse</strong>,{" "}
            <strong>Postgres</strong>, <strong>Athena</strong>,{" "}
            <strong>PrestoDB</strong>,<strong>Mixpanel</strong>, and{" "}
            <strong>Google Analytics</strong> with more coming soon.
          </p>
          <p>
            We only ever fetch aggregate data, so none of your user&apos;s
            Personally Identifiable Information ever hits our servers. Plus, we
            use multiple layers of encryption to store your credentials and
            require minimal read-only permissions, so you can be sure your
            source data remains secure.
          </p>
        </div>
      )}

      <button
        className="btn btn-success"
        onClick={(e) => {
          e.preventDefault();
          setEdit(DEFAULT_DATA_SOURCE);
        }}
      >
        <FaPlus /> Add Data Source
      </button>
      {edit && (
        <DataSourceForm
          existing={edit !== DEFAULT_DATA_SOURCE}
          data={edit}
          source={
            edit === DEFAULT_DATA_SOURCE
              ? "datasource-list"
              : "datasource-detail"
          }
          onSuccess={() => {
            mutateDefinitions({});
          }}
          onCancel={() => {
            setEdit(null);
          }}
        />
      )}
    </div>
  );
};

export default DataSources;
