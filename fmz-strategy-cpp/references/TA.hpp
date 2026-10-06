/*
 * AUTO-GENERATED DECLARATION-ONLY HEADER
 * Source: TA.hpp
 * Note: Function bodies were stripped to aid C++ LSP indexing.
 */

#include <string>
#include <array>
#include <map>
#include <vector>
using namespace std;

class TAHelper {
  public:
    array<vector<double>, 3> MACD(vector<double> &ticks, size_t fastEMA = 12, size_t slowEMA = 26, size_t signalEMA = 9) ;

    array<vector<double>, 3> MACD(Records &records, size_t fastEMA = 12, size_t slowEMA = 26, size_t signalEMA = 9) ;

    array<vector<double>, 3> KDJ(Records &records, size_t n = 9, size_t k = 3, size_t d = 3) ;

    vector<double> RSI(vector<double> &ticks, size_t period = 14) ;

    vector<double> RSI(Records &records, size_t period = 14) ;

    vector<double> ATR(Records &records, size_t period = 14) ;

    vector<double> OBV(Records &records) ;

    vector<double> MA(vector<double> &ticks, size_t period = 9) ;

    vector<double> MA(Records &records, size_t period = 9) ;

    vector<double> SMA(vector<double> &ticks, size_t period = 9) ;

    vector<double> SMA(Records &records, size_t period = 9) ;

    vector<double> EMA(vector<double> &ticks, size_t period = 9) ;

    vector<double> EMA(Records &records, size_t period = 9) ;

    array<vector<double>, 3> BOLL(vector<double> &S, size_t period = 20, double multiplier = 2) ;

    array<vector<double>, 3> BOLL(Records &records, size_t period = 20, double multiplier = 2) ;

    array<vector<double>, 3> Alligator(Records &records, size_t jawLength = 13, size_t teethLength = 8, size_t lipsLength = 5) ;

    vector<double> CMF(Records &records, size_t periods = 20) ;

    double Highest(vector<double> records, size_t n) ;

    double Lowest(vector<double> records, size_t n) ;
};

TAHelper TA;
