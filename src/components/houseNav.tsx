import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteHouse, DeleteHouseVariables } from "src/generated/DeleteHouse";

interface IProps {
  house: {
    id: string;
    userId: string;
  };
}

const DELETE_MUTATION = gql`
  mutation DeleteHouse($id: String!) {
    deleteHouse(id: $id)
  }
`;

export default function HouseNav({ house }: IProps) {
  const router = useRouter();
  const [deleteHouse, { loading }] = useMutation<
    DeleteHouse,
    DeleteHouseVariables
  >(DELETE_MUTATION);
  const { user } = useAuth();
  const canManage = !!user && user.uid === house.userId;
  return (
    <>
      <Link href="/">
        <a>map</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/houses/${house.id}/edit`}>
            <a>edit</a>
          </Link>
          {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this house")) {
                await deleteHouse({
                  variables: {
                    id: house.id,
                  },
                });
                router.push("/");
              }
            }}
          >
            Delete
          </button>
        </>
      )}
    </>
  );
}
