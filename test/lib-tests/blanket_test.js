test( "blanket instrument", function() {
    expect(2);
    var infile = "var a=1;if(a==1){a=2;}if(a==3){a=4;}console.log(a);";
    var infilename= "testfile";
    blanket.instrument({
        inputFile: infile,
        inputFileName: infilename
    },function(instrumented){
         ok( instrumented.length > infile.length, "instrumented." );
         ok(instrumented.indexOf("_$blanket['"+infilename+"']") > -1,"added enough instrumentation.");
     });
});

test( "blanket instrument elseif block", function() {
    expect(1);
    var expected = 4,
        result;

    var infile = "var a=3;if(a==1){a=2;}else if(a==3){a="+expected+";}\nresult=a;";
    var infilename= "testfile2";
    blanket.instrument({
        inputFile: infile,
        inputFileName: infilename
    },function(instrumented){
        eval(instrumented);
         ok( result == expected, "instrumented properly." );
         
     });
 
});

test( "blanket instrument for in", function() {
    expect(1);
    var result;
    var infile = "var arr=[]; result = window.alert ? (function() {\n for ( var key in arr ) {\n arr[ key ]=0; \n}return true; \n})() : false;";
    var infilename= "testfile3";
    blanket.instrument({
        inputFile: infile,
        inputFileName: infilename
    },function(instrumented){
        eval(instrumented);
         ok( result, "instrumented properly." );
         
     });
});

test( "blanket instrument branch", function() {
    expect(2);
    var expected = 10,
        result;
    var x=true;
    var infile = "var a=x===true?10:20;result=a";
    var infilename= "branch_testfile";
    blanket.options("branchTracking",true);
    blanket.instrument({
        inputFile: infile,
        inputFileName: infilename
    },function(instrumented){
        eval(instrumented);
        x=false;
        eval(instrumented);
        ok(window._$blanket[infilename].branchData[1][6][0],"passed first branch");
        ok(window._$blanket[infilename].branchData[1][6][1]===false,"passed second branch");
        blanket.options("branchTracking",false);
     });
 
});

test('get/set options', function(){
    ok(blanket.options("filter") === null,"get filter");
    ok(blanket.options("ignoreScriptError") === false,"get ignore");
    ok(blanket.options("orderedLoading") === true,"get ordered");
    ok(blanket.options("existingRequireJS") === false,"get existing");
    ok(blanket.options("reporter") === null,"get reporter");
    ok(blanket.options("loader") === null,"get loader");
    ok(blanket.options("adapter") === null,"get adapter");

    blanket.options({
        filter: "test",
        ignoreScriptError: true,
        orderedLoading: false,
        existingRequireJS: true,
        reporter: "test1",
        loader: "test2",
        adapter: "test3"
    });

    ok(blanket.options("filter") === "test","get filter");
    ok(blanket.options("ignoreScriptError") === true,"get ignore");
    ok(blanket.options("orderedLoading") === false,"get order");
    ok(blanket.options("existingRequireJS") === true,"get existing");
    ok(blanket.options("reporter") === "test1","get reporter");
    ok(blanket.options("loader") === "test2","get loader");
    ok(blanket.options("adapter") === "test3","get adapter");

    blanket.options("filter",null);
    blanket.options("ignoreScriptError",false);
    blanket.options("orderedLoading",true);
    blanket.options("existingRequireJS",false);
    blanket.options("reporter",null);
    blanket.options("loader",null);
    blanket.options("adapter",null);

    ok(blanket.options("filter") === null,"get filter");
    ok(blanket.options("ignoreScriptError") === false,"get ignore");
    ok(blanket.options("orderedLoading") === true,"get ordered");
    ok(blanket.options("existingRequireJS") === false,"get existing");
    ok(blanket.options("reporter") === null,"get reporter");
    ok(blanket.options("loader") === null,"get loader");
    ok(blanket.options("adapter") === null,"get adapter");
});

test('test events', function(){
    expect(1);
    blanket.report = function(result){
      ok(result.instrumentation==="blanket");
    };
    blanket.options("reporter",blanket.report);
    blanket.setupCoverage();
    blanket.onModuleStart();
    blanket.onTestStart();
    blanket.onTestDone();
    blanket.onTestsDone();
 });
