import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import customStyles from "./styles";
import PlanTable from "components/PdfDocument/planTable";

const styles = StyleSheet.create(customStyles);

export function PdfDocument(props) {
  const { data, chartImage, chartImage2, userFinancial, userInfo } = props;
  var hospitalizationSum = "";
  var hospitalizationIncomeSum = "";
  var sumofFinancialSummary = {};

  const riskManagementPolicies = !data.policies
    ? [] : data.policies.filter(p => p.planningNeeds && p.planningNeeds.toUpperCase() ===
      "Risk Management".toUpperCase());

  const wealthPremiumPolicies = !data.policies
    ? [] : data.policies.filter(p => p.planningNeeds && p.planningNeeds.toUpperCase() ===
      "Wealth Accumulation".toUpperCase());

  const wealthPreservationPolicies = !data.policies
    ? [] : data.policies.filter(p => p.planningNeeds && p.planningNeeds.toUpperCase() ===
      "Wealth Preservation".toUpperCase());


  if (data && data.policies) {
    let value = {
      accidentalDeath: 0,
      accidentalDisability: 0,
      accidentalReimbursement: 0,
      criticalIllness: 0,
      death: 0,
      disabilityIncome: 0,
      earlyCriticalIllness: 0,
      hospitalIncome: "",
      hospitalization: "",
      other: "",
      totalPermanentDisability: 0
    };

    data.policies.forEach(item => {
      let benefit = item.benefit;
      value.accidentalDeath += parseInt(benefit.accidentalDeath, 10)
        ? parseInt(benefit.accidentalDeath, 10)
        : 0;
      value.accidentalDisability += parseInt(benefit.accidentalDisability, 10)
        ? parseInt(benefit.accidentalDisability, 10)
        : 0;
      value.accidentalReimbursement += parseInt(
        benefit.accidentalReimbursement,
        10
      )
        ? parseInt(benefit.accidentalReimbursement, 10)
        : 0;
      value.death += parseInt(benefit.death, 10)
        ? parseInt(benefit.death, 10)
        : 0;
      value.disabilityIncome += parseInt(benefit.disabilityIncome, 10)
        ? parseInt(benefit.disabilityIncome, 10)
        : 0;
      value.earlyCriticalIllness += parseInt(benefit.earlyCriticalIllness, 10)
        ? parseInt(benefit.earlyCriticalIllness, 10)
        : 0;
      value.criticalIllness += parseInt(benefit.criticalIllness, 10)
        ? parseInt(benefit.criticalIllness, 10)
        : 0;

      value.hospitalIncome = benefit.hospitalIncome
        ? benefit.hospitalIncome
        : null;
      value.hospitalization =
        benefit.hospitalization !== "" ? benefit.hospitalization : null;
      value.totalPermanentDisability += parseInt(benefit.totalPermanentDisability, 10)
        ? parseInt(benefit.totalPermanentDisability, 10) : 0;
    });

    sumofFinancialSummary = value;

    for (let i = 0; i < data.policies.length; i++) {
      let policy = data.policies[i];
      if (i === data.policies.length - 1) {
        hospitalizationSum += policy.benefit.hospitalization;
        hospitalizationIncomeSum += policy.benefit.hospitalIncome;
      } else {
        hospitalizationSum += policy.benefit.hospitalization + ",";
        hospitalizationIncomeSum += policy.benefit.hospitalIncome + ",";
      }
    }
  }

  var canvas = document.createElement('canvas');
  canvas.id = "chart";
  canvas.width = 1000;
  canvas.height = 400;

  return (<Document>
    <Page style={{ margin: "0 auto", size: "A4" }}>
      {props.data.nricName ? (
        <View>
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <View style={{ backgroundColor: "#333", color: "#fff" }}>
              <View style={{ padding: "20" }}>
                <Text style={{ fontSize: "28" }}>Financial Portfolio</Text>
              </View>
              <View style={{ display: "table", marginLeft: "10" }}>
                <View style={styles.tableRow}>
                  <View style={{ width: "200" }}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      Name: {data.nricName}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      DOB:{moment(data.dob).format("DD-MMM-YYYY")}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      NRIC: {data.nric_passport}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: "table",
                  marginLeft: "10",
                  marginBottom: "20"
                }}
              >
                <View style={styles.tableRow}>
                  <View style={{ width: "200" }}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      Prepared By: {data.createdBy.fullName}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      FSC e-mail: {userInfo ? userInfo.emailAddress : ""}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      FSC phone: {userInfo ? userInfo.mobileNumber : ""}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <PlanTable
            planTitle="Risk Management"
            policies={riskManagementPolicies}
          />
          <PlanTable
            planTitle="Wealth Accumulation"
            policies={wealthPremiumPolicies}
          />
          <PlanTable
            planTitle="Preservation"
            policies={wealthPreservationPolicies}
          />
        </View>
      ) : null}
    </Page>
    <Page style={{ margin: "0 auto", size: "A4" }}>
      {props.data.nricName ? (
        <View>
          <View style={{ padding: "20" }}>
            <View style={{ backgroundColor: "#333", color: "#fff" }}>
              <View style={{ padding: "20" }}>
                <Text style={{ fontSize: "28" }}>Financial Portfolio</Text>
              </View>
              <View style={{ display: "table", marginLeft: "10" }}>
                <View style={styles.tableRow}>
                  <View style={{ width: "200" }}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      Name: {data.nricName}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      DOB:{moment(data.dob).format("DD-MMM-YYYY")}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      NRIC: {data.nric_passport}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  display: "table",
                  marginLeft: "10",
                  marginBottom: "20"
                }}
              >
                <View style={styles.tableRow}>
                  <View style={{ width: "200" }}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      Prepared By: {data.createdBy.fullName}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      FSC e-mail: {data.email}
                    </Text>
                  </View>
                  <View style={styles.ColC}>
                    <Text style={{ fontSize: 10, width: "200" }}>
                      FSC phone: {data.contact}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ paddingTop: 20 }}></View>
            <View style={styles.table2}>
              <View style={styles.tableRow}>
                <View style={styles.tableColMinWhite}></View>
                <View style={styles.tableColRisk}>
                  <Text style={styles.tableCell2Header}>Risk</Text>
                </View>
                <View style={styles.tableColBenefit}>
                  <Text style={styles.tableCell2Header}>Benefit</Text>
                </View>
                <View style={styles.tableColRiskSeg}>
                  <Text style={styles.tableCell2Header}>Risk Segment</Text>
                </View>
                <View style={styles.tableColOptimisation}>
                  <Text style={styles.tableCell2Header}>Optimisation</Text>
                </View>
              </View>
              {/* 1 */}
              <View style={styles.tableRow}>
                <View style={styles.tableColRB}>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinGreen}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>Death</Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(sumofFinancialSummary.death).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinGreen}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>TPD</Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(
                          sumofFinancialSummary.totalPermanentDisability
                        ).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinGreen}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>Disavility Income</Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(
                          sumofFinancialSummary.disabilityIncome
                        ).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinGreen}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>Critical Illness</Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(
                          sumofFinancialSummary.criticalIllness
                        ).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinGreen}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>
                        Early Critical Illness
                        </Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(
                          sumofFinancialSummary.earlyCriticalIllness
                        ).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tableColsRiskSeg}>
                  <Text style={styles.tableCellVertical}>
                    Income Protection
                    </Text>
                </View>
                <View style={styles.tableColOP}>
                  <View style={styles.tableRowOP}>
                    <View style={styles.tableColsOP}>
                      <Text style={styles.tableCellVertical}>
                        {userFinancial.death / 100} x of annual income
                        </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColsOP}>
                      <Text style={styles.tableCellVertical}>
                        {userFinancial.critical_illness / 100} x of annual
                        income
                        </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowOP}>
                    <View style={styles.tableColsOP}>
                      <Text style={styles.tableCellVertical}>
                        {userFinancial.early_critical_illness / 100} x of
                        annual income
                        </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* 1 */}
              <View style={styles.tableRow}>
                <View style={styles.tableColRB}>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinPink}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>Hospitalisation</Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        {hospitalizationSum}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinPink}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>
                        Hospitalisation Income
                        </Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        {hospitalizationIncomeSum}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tableColsRiskSeg1}>
                  <Text style={styles.tableCellVertical}>
                    Health Protection
                    </Text>
                </View>
                <View style={styles.tableColOP}>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColsOP}>
                      <Text style={styles.tableCellVertical}>
                        {hospitalizationSum}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColsOP}>
                      <Text style={styles.tableCellVertical}>
                        {hospitalizationIncomeSum}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={styles.tableColRB}>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinBlue}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>Accidental Death</Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(
                          sumofFinancialSummary.accidentalDeath
                        ).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinBlue}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>Accidental TPD</Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(
                          sumofFinancialSummary.accidentalDisability
                        ).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColMinBlue}></View>
                    <View style={styles.tableColsRisk}>
                      <Text style={styles.tableCell}>
                        Accidental Reimbursement
                        </Text>
                    </View>
                    <View style={styles.tableColsBenefit}>
                      <Text style={styles.tableCell}>
                        $
                          {Number(
                        parseFloat(
                          sumofFinancialSummary.accidentalReimbursement
                        ).toFixed(2)
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tableColsRiskSeg2}>
                  <Text style={styles.tableCellVertical}>
                    Accident Protection
                    </Text>
                </View>
                <View style={styles.tableColOP}>
                  <View style={styles.tableRowOP}>
                    <View style={styles.tableColsOP}>
                      <Text style={styles.tableCellVertical}>
                        ~$
                          {Number(
                        parseFloat(userFinancial.accidental_death).toFixed(
                          2
                        )
                      ).toLocaleString("en", { minimumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRowRisk}>
                    <View style={styles.tableColsOP}>
                      <Text style={styles.tableCellVertical}>
                        ~$
                          {Number(
                        parseFloat(
                          userFinancial.accidental_disability
                        ).toFixed(2)
                      ).toLocaleString("en", {
                        minimumFractionDigits: 0
                      })}{" "}
                        per injury
                        </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ paddingTop: 20 }}></View>
          </View>
        </View>
      ) : null}
      <View>
        {chartImage && chartImage !== '' ?
          <View style={{ paddingTop: 15, paddingBottom: 15 }}>
            <Image src={chartImage} />
          </View> : null}
        {chartImage2 && chartImage2 !== '' ?
          <View style={{ paddingTop: 15, paddingBottom: 30 }}>
            <Image src={chartImage2} />
          </View> : null}
      </View>
      <View style={styles.financialFooter} wrap={false}>
        <View style={{ display: "table", marginLeft: "10" }}>
          <View style={styles.tableRow}>
            <View style={{ width: "200" }}>
              <Text style={{ fontSize: "10" }}>Financial Portfolio</Text>
            </View>
            <View style={{ width: "95%", textAlign: "right" }}>
              <Text style={{ fontSize: 10, width: "300", textAlign: "right" }}>
                Prepared On: {moment.utc().format("DD-MMM-YYYY")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document >);
}

export const MemoizedPdfDocument = React.memo(PdfDocument);