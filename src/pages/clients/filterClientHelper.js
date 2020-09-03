import {
  parseISO
} from "date-fns";
import format from 'date-fns/format';

export function filterClientsBySearchText(clients, searchText) {
  function matchSearchText(input) {
    return input.trim().toLowerCase().indexOf(searchText.trim().toLowerCase()) >= 0;
  }

  function matchExactlySearchText(input) {
    return input.trim().toLowerCase() === searchText.trim().toLowerCase();
  }
  
  return searchText.trim() === "" ? clients : clients.filter((client) => {
    const isNamesMatch = (client.nricName && matchSearchText(client.nricName, searchText))
      || (client.preferredName && matchSearchText(client.preferredName, searchText))
      || (client.title && matchSearchText(client.title, searchText));

    const isNricMatch = client.nric_passport && matchSearchText(client.nric_passport, searchText);
    const isDoBMatch = client.dob && matchSearchText(format(parseISO(client.dob), "dd-MMM-yyyy"), searchText);
    const isGenderMatch = client.gender && matchExactlySearchText(client.gender, searchText);
    const isRaceMatch = client.race && matchSearchText(client.race, searchText);
    const isNationalityMatch = client.nationality && matchSearchText(client.nationality, searchText);
    const isOccupationMatch = client.occupation && matchSearchText(client.occupation, searchText);
    const isHobbiesMatch = client.hobbies && matchSearchText(client.hobbies, searchText);
    const isMaritalStatus = client.maritalStatus && matchSearchText(client.maritalStatus, searchText);
    const isCategoryMatch = client.category && matchSearchText(client.category, searchText);
    const isFamilyMatch = client.family && client.family.label && matchSearchText(client.family.label, searchText);
    const isFamlityRelationshipMatch = client.familyrelationship && matchSearchText(client.familyrelationship, searchText);
    const isReferMatch = client.referredsource && client.referredsource.label && matchSearchText(client.referredsource.label, searchText);
    const isOtherSourceMatch = client.othersource && matchSearchText(client.othersource, searchText);
    const isRemarksMatch = client.remarks && matchSearchText(client.remarks, searchText);

    return isNamesMatch || isNricMatch || isDoBMatch || isGenderMatch || isRaceMatch
      || isNationalityMatch || isOccupationMatch || isHobbiesMatch || isMaritalStatus
      || isCategoryMatch || isFamilyMatch || isFamlityRelationshipMatch || isReferMatch
      || isOtherSourceMatch || isRemarksMatch;
  });
}