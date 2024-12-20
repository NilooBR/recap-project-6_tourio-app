import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import { useState } from "react";
import { StyledLink } from "../../../components/StyledLink";
import { StyledButton } from "../../../components/StyledButton";
import { StyledImage } from "../../../components/StyledImage";

const ImageContainer = styled.div`
  position: relative;
  height: 15rem;
`;

const ButtonContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;

  & > * {
    flex-grow: 1;
    text-align: center;
  }
`;

const StyledLocationLink = styled(StyledLink)`
  text-align: center;
  background-color: lightgray;
  color: black;
  border: none;
`;

const ConfirmMessage = styled.div`
  text-align: center;
  color: red;
  padding: 1rem;
  border: 1px solid red;
  border-radius: 5px;
  margin-top: 1rem;
`;

export default function DetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  const { data: place, isLoading, error } = useSWR(`/api/places/${id}`);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  async function deletePlace() {
    try {
      await fetch(`/api/places/${id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting place:", error.message);
    }
  }

  return (
    <>
      <StyledLink href={"/"} $justifySelf="start">
        back
      </StyledLink>
      <ImageContainer>
        <StyledImage
          src={place.image}
          priority
          fill
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          alt=""
        />
      </ImageContainer>
      <h2>
        {place.name}, {place.location}
      </h2>
      <StyledLocationLink href={place.mapURL}>
        Location on Google Maps
      </StyledLocationLink>
      <p>{place.description}</p>
      <ButtonContainer>
        <StyledLink href={`/places/${id}/edit`}>Edit</StyledLink>
        <StyledButton
          onClick={() => setShowConfirm(true)}
          type="button"
          $variant="delete"
        >
          Delete
        </StyledButton>
      </ButtonContainer>
      {showConfirm && (
        <ConfirmMessage>
          <p>Are you sure?</p>
          <ButtonContainer>
            <StyledButton
              onClick={deletePlace}
              type="button"
              $variant="delete"
            >
              Yes, Delete
            </StyledButton>
            <StyledButton
              onClick={() => setShowConfirm(false)}
              type="button"
            >
              Cancel
            </StyledButton>
          </ButtonContainer>
        </ConfirmMessage>
      )}
    </>
  );
}