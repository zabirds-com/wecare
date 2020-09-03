import { convertFrequencyToNumber } from "helpers/dateUtils";
import { differenceInCalendarYears, parseISO } from "date-fns";

export function getChartData(dateOfBirth, policies) {
  var protectionPremiums = [];
  var wealthPremiums = [];
  var savings = [];
  var investments = [];
  var cashValue = [];
  var deathCoverage = [];

  if (policies && policies.length > 0) {
    for (let i = 0; i < policies.length; i++) {
      let policy = policies[i];
      const multiplyer = convertFrequencyToNumber(policy.paymentFrequency);

      if (policy.benefit && parseFloat(policy.benefit.death)) {
        deathCoverage.push([parseInt(policy.ageIncepted), parseFloat(policy.benefit.death).toFixed(2)]);
      }

      if (policy.ageIncepted && policy.planningNeeds
        && policy.planningNeeds.toUpperCase() === "Risk Management".toUpperCase() && parseFloat(policy.premiumSGD)) {
        protectionPremiums.push([parseInt(policy.ageIncepted), Number(parseFloat(policy.premiumSGD) * multiplyer).toFixed(2, 2)]);
      }

      if (policy.planningNeeds && parseFloat(policy.premiumSGD) && (policy.planningNeeds.toUpperCase() === "Wealth Accumulation".toUpperCase()
        || policy.planningNeeds.toUpperCase() === "Wealth Preservation".toUpperCase())) {
        wealthPremiums.push([parseInt(policy.ageIncepted), Number(parseFloat(policy.premiumSGD) * multiplyer).toFixed(2)]);
      }

      if (policy.policyType && policy.planningNeeds && policy.policyType.toUpperCase() === "ILP".toUpperCase()
        && (policy.planningNeeds.toUpperCase() === "Wealth Accumulation".toUpperCase()
          || policy.planningNeeds.toUpperCase() === "Wealth Preservation".toUpperCase())) {
        if (parseFloat(policy.investmentValueAmount1)) {
          investments.push([parseInt(policy.investmentValueAge1), parseFloat(policy.investmentValueAmount1).toFixed(2)]);
        }
        if (parseFloat(policy.investmentValueAmount2)) {
          investments.push([parseInt(policy.investmentValueAge2), parseFloat(policy.investmentValueAmount2).toFixed(2)])
        }
        if (parseFloat(policy.investmentValueAmount3)) {
          investments.push([parseInt(policy.investmentValueAge3), parseFloat(policy.investmentValueAmount3).toFixed(2)]);
        }
      }

      if (policy.policyType && policy.planningNeeds && policy.policyType.toUpperCase() !== "ILP".toUpperCase()
        && (policy.planningNeeds.toUpperCase() === "Wealth Accumulation".toUpperCase()
          || policy.planningNeeds.toUpperCase() === "Wealth Preservation".toUpperCase()) && parseFloat(policy.maturityAmount)) {
        savings.push([parseInt(policy.maturityAmountAge), parseFloat(policy.maturityAmount).toFixed(2)]);
      }

      if (parseFloat(policy.cashValueAmount) && parseFloat(policy.cashValueAge)) {
        cashValue.push([parseInt(policy.cashValueAge), parseFloat(policy.cashValueAmount).toFixed(2)]);
      }
    }


    const age = dateOfBirth ? differenceInCalendarYears(new Date(), parseISO(dateOfBirth)) : 0;

    protectionPremiums = protectionPremiums.sort((a, b) => a[0] - b[0]);
    wealthPremiums = wealthPremiums.sort((a, b) => a[0] - b[0]);
    deathCoverage = deathCoverage.sort((a, b) => a[0] - b[0]);
    savings = savings.sort((a, b) => a[0] - b[0]);
    cashValue = cashValue.sort((a, b) => a[0] - b[0]);
    investments = investments.sort((a, b) => a[0] - b[0]);

    const chart1Series = [];
    const chart1Colors = []

    if (savings.length > 0) {
      chart1Series.push({
        name: "Saving", type: 'column',
        data: savings
      });
      chart1Colors.push("rgba(213, 8, 0)");
    }

    if (cashValue.length > 0) {
      chart1Series.push({
        name: "Cash Value", type: 'column',
        data: cashValue
      });
      chart1Colors.push("rgba(0, 255, 255)");
    }

    if (deathCoverage.length > 0) {
      chart1Series.push({
        name: "Coverage", type: 'line',
        data: deathCoverage
      });
      chart1Colors.push("rgba(234, 90, 0)");
    }

    if (investments.length > 0) {
      chart1Series.push({
        name: "Investment", type: 'area',
        data: investments
      });
      chart1Colors.push("rgba(224, 224, 209)");
    }

    const max1 = Math.max(...chart1Series.reduce((a, v) => [...a, ...v.data.map(d => d[0])], []));
    const minXaxis1 = age;
    const maxXaxis1 = max1 < age ? age + 5 : max1 + 5;
    const tickAmount1 = maxXaxis1 - minXaxis1;

    //Generate a Line Chart with the Context
    const options1 = {
      height: 380,
      width: "100%",
      type: "line",
      chart: {
        events: {
          beforeZoom: function (ctx) {
            // we need to clear the range as we only need it on the iniital load.
            ctx.w.config.xaxis.min = undefined
          }
        }
      },
      series: chart1Series,
      options: {
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          min: minXaxis1,
          max: maxXaxis1,
          tickAmount: tickAmount1,
        },
        tooltip: {
          shared: true,
          x: {
            formatter: function (val) {
              return val ? (typeof (val) == 'string' ? parseFloat(val).toFixed(2) : val.toFixed(2)) : "";
            }
          }
        },
        colors: chart1Colors,
        stroke: {
          curve: 'smooth',
          lineCap: 'butt',
        },
        legend: {
          showForSingleSeries: true,
        }
      }
    };

    const chart2Series = [];
    const chart2Colors = []

    if (protectionPremiums.length > 0) {
      chart2Series.push({
        name: "Protection Premium", type: 'line',
        data: protectionPremiums,
      });
      chart2Colors.push("rgba(3, 8, 161)");
    }

    if (wealthPremiums.length > 0) {
      chart2Series.push({
        name: "Wealth Premium", type: 'line',
        data: wealthPremiums,
      });
      chart2Colors.push("rgba(0, 188, 0)");
    }

    const max2 = Math.max(...chart2Series.reduce((a, v) => [...a, ...v.data.map(d => d[0])], []));
    const minXaxis2 = age;
    const maxXaxis2 = max2 < age ? age + 5 : max2 + 5;
    const tickAmount2 = maxXaxis2 - minXaxis2;

    // chart 2
    //Generate a Line Chart with the Context
    const options2 = {
      height: 380,
      width: "100%",
      type: "line",
      id: "chartt2",
      chart: {
        events: {
          beforeZoom: function (ctx) {
            // we need to clear the range as we only need it on the iniital load.
            ctx.w.config.xaxis.min = undefined
            ctx.w.config.xaxis.range = undefined
          }
        }
      },
      series: chart2Series,
      options: {
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          min: minXaxis2,
          max: maxXaxis2,
          tickAmount: tickAmount2,
        },
        tooltip: {
          shared: true,
          x: {
            formatter: function (val) {
              return val ? (typeof (val) == 'string' ? parseFloat(val).toFixed(2) : val.toFixed(2)) : "";
            }
          }
        },
        colors: chart2Colors,
        stroke: {
          curve: 'smooth',
          lineCap: 'butt',
        },
        legend: {
          showForSingleSeries: true,
        }
      }
    };

    return {
      options1, options2
    };
  }

  return {};
}